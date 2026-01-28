import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Canvas, Fill, Shader, Skia } from "@shopify/react-native-skia";
import { 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  Easing, 
  useDerivedValue 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// --- LE SHADER (Reste inchangé) ---
const source = Skia.RuntimeEffect.Make(`
uniform float u_time;
uniform vec2 u_resolution;

// Fonction de bruit pour les vagues organiques
vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p ) {
    const float K1 = 0.366025404; 
    const float K2 = 0.211324865; 

    vec2 i = floor( p + (p.x+p.y)*K1 );
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;

    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));

    return dot( n, vec3(70.0) );
}

vec4 main(vec2 pos) {
    vec2 uv = pos / u_resolution;
    
    // 1. Mouvement des vagues
    float movement = u_time * 0.2;
    vec2 waveUV = uv;
    waveUV.y += 0.1 * sin(uv.x * 3.0 + movement);
    waveUV.x += 0.1 * cos(uv.y * 3.0 + movement);
    
    // 2. Couleurs du gradient (Bleu profond -> Aqua)
    vec3 colBottom = vec3(0.02, 0.05, 0.15); // #050d26
    vec3 colMiddle = vec3(0.1, 0.3, 0.8);    // #194ccf
    vec3 colTop = vec3(0.2, 0.6, 1.0);       // #3399ff
    
    // Mélange des couleurs
    vec3 color = mix(colBottom, colMiddle, smoothstep(0.0, 0.6, waveUV.y));
    color = mix(color, colTop, smoothstep(0.5, 1.2, waveUV.y));
    
    // 3. Effet "Étoiles" / Reflets de l'eau
    float glint = noise(uv * 12.0 + vec2(u_time * 0.5, u_time * 0.3));
    float sparkle = smoothstep(0.65, 0.7, glint); 
    
    // Ajout de l'éclat blanc
    color += vec3(1.0) * sparkle * 0.4; 

    return vec4(color, 1.0);
}
`);

export default function WaterBackground() {
  // On utilise uniquement useSharedValue de Reanimated
  const time = useSharedValue(0);

  useEffect(() => {
    time.value = withRepeat(
      withTiming(200, { duration: 40000, easing: Easing.linear }),
      -1, 
      false
    );
  }, []);

  // On crée un objet "uniforms" qui est lui-même une SharedValue
  // Skia va lire cet objet à chaque frame sans re-rendre le composant React
  const uniforms = useDerivedValue(() => {
    return {
      u_time: time.value,
      u_resolution: [width, height],
    };
  });

  if (!source) {
    // Fallback si le shader ne compile pas
    return <View style={StyleSheet.absoluteFill} backgroundColor="#0f172a" />;
  }

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: -1 }]}>
      <Canvas style={{ flex: 1 }}>
        <Fill>
          <Shader
            source={source}
            uniforms={uniforms} 
          />
        </Fill>
      </Canvas>
    </View>
  );
}