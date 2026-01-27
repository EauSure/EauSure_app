// app/index.jsx
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { Droplets, Activity, AlertTriangle, Battery } from 'lucide-react-native';
// import client from '../api/client'; // Décommentez quand l'API est prête

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  // Données mockées pour l'instant
  const [data, setData] = useState({ ph: 7.2, tds: 140, battery: 85, status: 'normal' });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler un appel API
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 p-4 pt-12"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text className="text-2xl font-bold text-blue-900 mb-6">Ma Bouée</Text>

      {/* Alerte Chute */}
      {data.status === 'alert' && (
        <View className="bg-red-100 border border-red-400 p-4 rounded-xl flex-row items-center mb-6">
          <AlertTriangle color="#dc2626" size={32} />
          <View className="ml-4">
            <Text className="text-red-700 font-bold text-lg">ALERTE CHUTE</Text>
          </View>
        </View>
      )}

      {/* Cartes Données */}
      <View className="flex-row flex-wrap justify-between">
        <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4">
            <Text className="text-slate-500 mb-2">pH Eau</Text>
            <Text className="text-3xl font-bold text-slate-800">{data.ph}</Text>
            <Droplets size={20} color="#3b82f6" style={{position:'absolute', right:10, top:10}}/>
        </View>

        <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4">
            <Text className="text-slate-500 mb-2">TDS (ppm)</Text>
            <Text className="text-3xl font-bold text-slate-800">{data.tds}</Text>
            <Activity size={20} color="#8b5cf6" style={{position:'absolute', right:10, top:10}}/>
        </View>

        <View className="w-full bg-white p-4 rounded-2xl shadow-sm mb-4 flex-row items-center justify-between">
           <View>
             <Text className="text-slate-500">Batterie</Text>
             <Text className="text-2xl font-bold text-slate-800">{data.battery}%</Text>
           </View>
           <Battery size={30} color={data.battery > 20 ? "#10b981" : "#ef4444"} />
        </View>
      </View>
    </ScrollView>
  );
}