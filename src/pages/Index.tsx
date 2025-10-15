import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Character {
  id: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'ancient';
  type: 'charge' | 'ambush' | 'ranged' | 'healing' | 'support' | 'magic' | 'bomber';
  image: string;
  imageUrl?: string;
  level: number;
  power: number;
  hp: number;
  attack: number;
  defense: number;
  critRate: number;
  skill: string;
  owned: boolean;
  topping?: string[];
  lovePartner?: number;
}

interface Kingdom {
  level: number;
  cookies: number;
  gems: number;
  buildings: Building[];
}

interface Building {
  id: number;
  name: string;
  level: number;
  icon: string;
  production: number;
  upgradeTime: number;
}

interface Stage {
  id: number;
  world: string;
  stage: string;
  difficulty: number;
  stars: number;
  unlocked: boolean;
}

const Index = () => {
  const [activeScreen, setActiveScreen] = useState<'kingdom' | 'battle' | 'gacha' | 'team'>('kingdom');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [kingdom, setKingdom] = useState<Kingdom>({
    level: 12,
    cookies: 15420,
    gems: 350,
    buildings: [
      { id: 1, name: 'Замок', level: 10, icon: '🏰', production: 100, upgradeTime: 3600 },
      { id: 2, name: 'Лаборатория', level: 8, icon: '🧪', production: 50, upgradeTime: 1800 },
      { id: 3, name: 'Ферма', level: 9, icon: '🌾', production: 75, upgradeTime: 2400 },
      { id: 4, name: 'Желейная Шахта', level: 7, icon: '⛏️', production: 60, upgradeTime: 2100 },
    ]
  });

  const [team, setTeam] = useState<number[]>([1, 2, 3, 4, 5]);
  const [gacha, setGacha] = useState({ pulling: false, result: null as Character | null });
  const [battleProgress, setBattleProgress] = useState(0);
  const [playingStage, setPlayingStage] = useState<Stage | null>(null);

  const characters: Character[] = [
    { 
      id: 1, 
      name: 'Храброе Печенье', 
      rarity: 'epic', 
      type: 'charge',
      image: '⚔️', 
      level: 60, 
      power: 285000,
      hp: 85000,
      attack: 3200,
      defense: 1800,
      critRate: 28,
      skill: 'Героический Натиск',
      owned: true,
      topping: ['Сладкое желе малины', 'Шоколадная стружка']
    },
    { 
      id: 2, 
      name: 'Клубничное Печенье', 
      rarity: 'rare', 
      type: 'healing',
      image: '🍓', 
      level: 58, 
      power: 210000,
      hp: 60000,
      attack: 1500,
      defense: 1200,
      critRate: 15,
      skill: 'Клубничный Нектар',
      owned: true,
      topping: ['Желе исцеления']
    },
    { 
      id: 3, 
      name: 'Эспрессо', 
      rarity: 'epic', 
      type: 'magic',
      image: '☕', 
      level: 60, 
      power: 295000,
      hp: 70000,
      attack: 3800,
      defense: 1400,
      critRate: 35,
      skill: 'Кофейная Магия',
      owned: true,
      topping: ['Шоколадная стружка']
    },
    { 
      id: 4, 
      name: 'Ликорис', 
      rarity: 'epic', 
      type: 'support',
      image: '🎭', 
      level: 55, 
      power: 240000,
      hp: 65000,
      attack: 2100,
      defense: 1600,
      critRate: 20,
      skill: 'Театр Иллюзий',
      owned: true,
      topping: ['Желе шоколада']
    },
    { 
      id: 5, 
      name: 'Холли Берри', 
      rarity: 'ancient', 
      type: 'charge',
      image: '🛡️', 
      level: 60, 
      power: 320000,
      hp: 120000,
      attack: 2200,
      defense: 3500,
      critRate: 12,
      skill: 'Божественный Щит',
      owned: true,
      topping: ['Желе крепости']
    },
    { 
      id: 6, 
      name: 'Ванильное Печенье', 
      rarity: 'common', 
      type: 'healing',
      image: '🥛', 
      level: 45, 
      power: 150000,
      hp: 50000,
      attack: 1200,
      defense: 900,
      critRate: 10,
      skill: 'Молочное Утешение',
      owned: true
    },
    { 
      id: 7, 
      name: 'Чёрный Жемчуг', 
      rarity: 'legendary', 
      type: 'bomber',
      image: '🌊', 
      level: 60, 
      power: 340000,
      hp: 90000,
      attack: 4200,
      defense: 1500,
      critRate: 40,
      skill: 'Гнев Океана',
      owned: false
    },
    { 
      id: 8, 
      name: 'Чистая Ваниль', 
      rarity: 'ancient', 
      type: 'healing',
      image: '✨', 
      level: 60, 
      power: 310000,
      hp: 75000,
      attack: 1800,
      defense: 2000,
      critRate: 18,
      skill: 'Свет Исцеления',
      owned: false
    },
    {
      id: 9,
      name: 'Золотой Сыр',
      rarity: 'ancient',
      type: 'magic',
      imageUrl: 'https://cdn.poehali.dev/files/0638c90f-4da4-48ab-ab9d-e29162e38801.png',
      image: '🏹',
      level: 60,
      power: 355000,
      hp: 95000,
      attack: 4500,
      defense: 2000,
      critRate: 45,
      skill: 'Золотая Стрела',
      owned: true,
      topping: ['Шоколадная стружка', 'Желе малины']
    },
    {
      id: 10,
      name: 'Белая Лилия',
      rarity: 'ancient',
      type: 'healing',
      imageUrl: 'https://cdn.poehali.dev/files/0c876b89-e93c-456e-b07c-ad5eaeaf3bc3.png',
      image: '🌸',
      level: 60,
      power: 315000,
      hp: 72000,
      attack: 1800,
      defense: 1500,
      critRate: 20,
      skill: 'Благословение Лилии',
      owned: true,
      topping: ['Желе исцеления'],
      lovePartner: 11
    },
    {
      id: 11,
      name: 'Тёмное Молоко',
      rarity: 'legendary',
      type: 'magic',
      imageUrl: 'https://cdn.poehali.dev/files/000231f0-2d58-4f44-a8f4-7bcb573da562.jpg',
      image: '🌙',
      level: 60,
      power: 345000,
      hp: 88000,
      attack: 4200,
      defense: 1700,
      critRate: 42,
      skill: 'Теневая Буря',
      owned: true,
      topping: ['Шоколадная стружка', 'Желе малины'],
      lovePartner: 10
    },
  ];

  const [stages, setStages] = useState<Stage[]>([
    { id: 1, world: 'Мир 1', stage: '1-1', difficulty: 1, stars: 3, unlocked: true },
    { id: 2, world: 'Мир 1', stage: '1-10', difficulty: 2, stars: 3, unlocked: true },
    { id: 3, world: 'Мир 2', stage: '2-1', difficulty: 3, stars: 2, unlocked: true },
    { id: 4, world: 'Мир 3', stage: '3-5', difficulty: 5, stars: 1, unlocked: true },
    { id: 5, world: 'Мир 4', stage: '4-1', difficulty: 7, stars: 0, unlocked: true },
    { id: 6, world: 'Мир 5', stage: '5-1', difficulty: 10, stars: 0, unlocked: false },
  ]);

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'from-gray-300 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-700';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      case 'ancient': return 'from-pink-400 via-purple-500 to-indigo-600';
      default: return 'from-gray-300 to-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'border-gray-400';
      case 'rare': return 'border-blue-500';
      case 'epic': return 'border-purple-500';
      case 'legendary': return 'border-yellow-500';
      case 'ancient': return 'border-pink-500';
      default: return 'border-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'charge': return '⚔️';
      case 'ambush': return '🗡️';
      case 'ranged': return '🏹';
      case 'healing': return '💚';
      case 'support': return '🎵';
      case 'magic': return '✨';
      case 'bomber': return '💣';
      default: return '❓';
    }
  };

  const handleGacha = () => {
    if (kingdom.gems < 30) {
      toast.error('Недостаточно кристаллов!');
      return;
    }

    setKingdom({ ...kingdom, gems: kingdom.gems - 30 });
    setGacha({ pulling: true, result: null });
    
    setTimeout(() => {
      const random = Math.random();
      let result;
      
      if (random < 0.01) {
        result = characters.find(c => c.rarity === 'ancient' && !c.owned) || characters[4];
      } else if (random < 0.05) {
        result = characters.find(c => c.rarity === 'legendary' && !c.owned) || characters[6];
      } else if (random < 0.20) {
        result = characters.find(c => c.rarity === 'epic') || characters[0];
      } else {
        result = characters.find(c => c.rarity === 'rare') || characters[1];
      }
      
      setGacha({ pulling: false, result });
      toast.success(`Вы получили: ${result.name}!`, {
        description: `Редкость: ${result.rarity.toUpperCase()}`
      });
    }, 2000);
  };

  const upgradeBuilding = (buildingId: number) => {
    const building = kingdom.buildings.find(b => b.id === buildingId);
    if (building && kingdom.cookies >= building.production * 10) {
      setKingdom({
        ...kingdom,
        cookies: kingdom.cookies - building.production * 10,
        buildings: kingdom.buildings.map(b => 
          b.id === buildingId ? { ...b, level: b.level + 1, production: b.production + 10 } : b
        )
      });
      toast.success(`${building.name} улучшено до уровня ${building.level + 1}!`);
    } else {
      toast.error('Недостаточно печенюшек!');
    }
  };

  const playStage = (stage: Stage) => {
    if (!stage.unlocked) return;
    
    setPlayingStage(stage);
    setBattleProgress(0);
    
    const interval = setInterval(() => {
      setBattleProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completeStage(stage);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const completeStage = (stage: Stage) => {
    setTimeout(() => {
      const earnedStars = Math.floor(Math.random() * 3) + 1;
      const reward = stage.difficulty * 50;
      
      setKingdom({ ...kingdom, cookies: kingdom.cookies + reward });
      setStages(stages.map(s => {
        if (s.id === stage.id) {
          return { ...s, stars: Math.max(s.stars, earnedStars) };
        }
        if (s.id === stage.id + 1 && earnedStars === 3) {
          return { ...s, unlocked: true };
        }
        return s;
      }));
      
      toast.success(`Уровень пройден! +${reward} печенюшек`, {
        description: `Получено звёзд: ${earnedStars}/3`
      });
      
      setPlayingStage(null);
      setBattleProgress(0);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-white drop-shadow-lg">🍪 Cookie Kingdom</div>
              <Badge className="bg-yellow-400 text-yellow-900 border-2 border-yellow-600 font-bold">
                Ур. {kingdom.level}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 shadow-lg border-2 border-amber-400">
                <span className="text-2xl">🍪</span>
                <span className="font-bold text-amber-700">{kingdom.cookies.toLocaleString()}</span>
              </div>
              <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 shadow-lg border-2 border-blue-400">
                <span className="text-2xl">💎</span>
                <span className="font-bold text-blue-700">{kingdom.gems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20">
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-purple-600 shadow-2xl z-40 border-t-4 border-yellow-400">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-around">
              {[
                { id: 'kingdom', icon: 'Castle', label: 'Королевство' },
                { id: 'team', icon: 'Users', label: 'Команда' },
                { id: 'battle', icon: 'Sword', label: 'Битва' },
                { id: 'gacha', icon: 'Gift', label: 'Гача' },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveScreen(tab.id as any)}
                  className={`flex flex-col items-center gap-1 px-6 py-3 rounded-2xl transition-all ${
                    activeScreen === tab.id
                      ? 'bg-white text-purple-600 scale-110 shadow-xl'
                      : 'bg-transparent text-white hover:bg-white/20'
                  }`}
                >
                  <Icon name={tab.icon} size={24} />
                  <span className="text-xs font-bold">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
          {activeScreen === 'kingdom' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-gradient-to-r from-yellow-300 to-orange-400 rounded-3xl p-6 shadow-2xl border-4 border-yellow-500">
                <h2 className="text-3xl font-black text-white drop-shadow-lg mb-4 flex items-center gap-3">
                  <span>🏰</span> Ваше Королевство
                </h2>
                <p className="text-white font-semibold text-lg">Развивайте здания и производите ресурсы!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kingdom.buildings.map((building) => (
                  <Card key={building.id} className="overflow-hidden border-4 border-purple-300 shadow-xl hover:scale-105 transition-transform">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-5xl">{building.icon}</div>
                            <div>
                              <h3 className="text-xl font-black text-white drop-shadow">{building.name}</h3>
                              <Badge className="bg-white/90 text-purple-700 font-bold">Ур. {building.level}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
                          <div className="flex items-center justify-between text-white font-bold">
                            <span>Производство:</span>
                            <span className="text-yellow-300">+{building.production}/час</span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => upgradeBuilding(building.id)}
                          className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-lg shadow-lg border-2 border-green-600"
                        >
                          Улучшить ({building.production * 10} 🍪)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeScreen === 'team' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl p-6 shadow-2xl border-4 border-purple-600">
                <h2 className="text-3xl font-black text-white drop-shadow-lg mb-4 flex items-center gap-3">
                  <Icon name="Users" className="text-white" /> Ваша Команда
                </h2>
                <p className="text-white font-semibold text-lg">Управляйте своими печеньками!</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {characters.filter(c => c.owned).map((char) => (
                  <Card 
                    key={char.id} 
                    onClick={() => setSelectedChar(char)}
                    className={`overflow-hidden cursor-pointer hover:scale-105 transition-transform border-4 ${getRarityBorder(char.rarity)} shadow-2xl relative`}
                  >
                    {char.lovePartner && (
                      <div className="absolute top-2 right-2 z-10 bg-pink-500 text-white rounded-full p-1.5 shadow-lg animate-pulse">
                        💕
                      </div>
                    )}
                    <div className={`bg-gradient-to-br ${getRarityColor(char.rarity)} p-4`}>
                      {char.imageUrl ? (
                        <img src={char.imageUrl} alt={char.name} className="w-24 h-24 mx-auto object-contain drop-shadow-2xl" />
                      ) : (
                        <div className="text-6xl text-center mb-2">{char.image}</div>
                      )}
                      
                      <div className="text-center">
                        <Badge className="bg-white/90 text-xs font-bold mb-2">
                          {getTypeIcon(char.type)} {char.type.toUpperCase()}
                        </Badge>
                        <h3 className="text-white font-black text-sm drop-shadow">{char.name}</h3>
                        <p className="text-white/90 font-bold text-xs">Ур. {char.level}</p>
                        <div className="bg-white/20 backdrop-blur rounded-lg px-2 py-1 mt-2">
                          <p className="text-white font-bold text-xs">⚡ {char.power.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeScreen === 'battle' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-gradient-to-r from-red-400 to-orange-500 rounded-3xl p-6 shadow-2xl border-4 border-red-600">
                <h2 className="text-3xl font-black text-white drop-shadow-lg mb-4 flex items-center gap-3">
                  <Icon name="Sword" className="text-white" /> Режим Битвы
                </h2>
                <p className="text-white font-semibold text-lg">Пройдите уровни и получите награды!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stages.map((stage) => (
                  <Card 
                    key={stage.id}
                    className={`overflow-hidden border-4 shadow-xl hover:scale-105 transition-transform ${
                      stage.unlocked ? 'border-green-400 cursor-pointer' : 'border-gray-400 opacity-50'
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className={`bg-gradient-to-br ${stage.unlocked ? 'from-green-400 to-teal-500' : 'from-gray-400 to-gray-600'} p-6`}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-black text-white drop-shadow">{stage.world}</h3>
                            <p className="text-white font-bold text-lg">{stage.stage}</p>
                          </div>
                          <div className="bg-white/20 backdrop-blur rounded-full w-16 h-16 flex items-center justify-center">
                            <span className="text-3xl">{stage.unlocked ? '⚔️' : '🔒'}</span>
                          </div>
                        </div>

                        <div className="flex gap-1 mb-4">
                          {[1, 2, 3].map((star) => (
                            <span key={star} className="text-2xl">
                              {star <= stage.stars ? '⭐' : '☆'}
                            </span>
                          ))}
                        </div>

                        <Progress value={stage.difficulty * 10} className="mb-4" />
                        
                        {stage.unlocked && (
                          <Button 
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black shadow-lg border-2 border-yellow-600"
                            onClick={() => playStage(stage)}
                          >
                            Начать Битву!
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeScreen === 'gacha' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 rounded-3xl p-6 shadow-2xl border-4 border-yellow-500">
                <h2 className="text-3xl font-black text-white drop-shadow-lg mb-4 flex items-center gap-3">
                  <Icon name="Gift" className="text-white" /> Система Гача
                </h2>
                <p className="text-white font-semibold text-lg">Получите новых печенек!</p>
              </div>

              <Card className="border-4 border-pink-400 shadow-2xl overflow-hidden">
                <CardContent className="p-8 bg-gradient-to-br from-purple-100 to-pink-100">
                  <div className="text-center space-y-6">
                    {gacha.pulling ? (
                      <div className="animate-bounce">
                        <div className="text-9xl">🎁</div>
                        <p className="text-2xl font-black text-purple-700 mt-4">Открываем...</p>
                        <Progress value={50} className="mt-4" />
                      </div>
                    ) : gacha.result ? (
                      <div className="animate-in zoom-in duration-500">
                        <div className={`bg-gradient-to-br ${getRarityColor(gacha.result.rarity)} rounded-3xl p-8 mb-4 border-4 ${getRarityBorder(gacha.result.rarity)}`}>
                          {gacha.result.imageUrl ? (
                            <img src={gacha.result.imageUrl} alt={gacha.result.name} className="w-48 h-48 mx-auto object-contain drop-shadow-2xl" />
                          ) : (
                            <div className="text-9xl mb-4">{gacha.result.image}</div>
                          )}
                          <h3 className="text-3xl font-black text-white drop-shadow-lg">{gacha.result.name}</h3>
                          <Badge className="bg-white/90 text-lg font-bold mt-2">
                            {gacha.result.rarity.toUpperCase()}
                          </Badge>
                        </div>
                        <Button 
                          onClick={() => setGacha({ pulling: false, result: null })}
                          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl px-8 py-6"
                        >
                          Отлично!
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-9xl mb-6">🎰</div>
                        <h3 className="text-3xl font-black text-purple-700 mb-4">Получите новое печенье!</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6 text-left bg-white/60 rounded-2xl p-6">
                          <div>
                            <p className="font-bold text-gray-600">Ancient:</p>
                            <p className="text-pink-600 font-black">1%</p>
                          </div>
                          <div>
                            <p className="font-bold text-gray-600">Legendary:</p>
                            <p className="text-yellow-600 font-black">4%</p>
                          </div>
                          <div>
                            <p className="font-bold text-gray-600">Epic:</p>
                            <p className="text-purple-600 font-black">15%</p>
                          </div>
                          <div>
                            <p className="font-bold text-gray-600">Rare:</p>
                            <p className="text-blue-600 font-black">80%</p>
                          </div>
                        </div>
                        <Button 
                          onClick={handleGacha}
                          disabled={kingdom.gems < 30}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-2xl px-12 py-8 rounded-2xl shadow-2xl border-4 border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Открыть за 30 💎
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!playingStage} onOpenChange={() => setPlayingStage(null)}>
        <DialogContent className="bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-white text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center text-white mb-4">
              {playingStage?.world} - {playingStage?.stage}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">⚔️</div>
              <p className="text-xl font-semibold">Битва идёт...</p>
            </div>
            <Progress value={battleProgress} className="h-4" />
            <div className="text-center text-lg font-bold">
              {battleProgress}%
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedChar} onOpenChange={() => setSelectedChar(null)}>
        <DialogContent className="max-w-md border-4 border-purple-400 bg-white">
          {selectedChar && (
            <div className="space-y-4 -mt-6 -mx-6">
              <div className={`bg-gradient-to-br ${getRarityColor(selectedChar.rarity)} p-8 rounded-t-lg relative`}>
                {selectedChar.lovePartner && (
                  <div className="absolute top-4 right-4 bg-pink-500 text-white rounded-full px-3 py-1 shadow-lg text-sm font-bold flex items-center gap-1">
                    💕 В любви
                  </div>
                )}
                {selectedChar.imageUrl ? (
                  <img src={selectedChar.imageUrl} alt={selectedChar.name} className="w-40 h-40 mx-auto object-contain drop-shadow-2xl" />
                ) : (
                  <div className="text-9xl text-center">{selectedChar.image}</div>
                )}
                <div className="text-center mt-4">
                  <Badge className="bg-white/90 font-bold text-lg mb-2">
                    {getTypeIcon(selectedChar.type)} {selectedChar.type.toUpperCase()}
                  </Badge>
                  <h2 className="text-3xl font-black text-white drop-shadow-lg">{selectedChar.name}</h2>
                  <p className="text-white/90 font-bold text-xl">Уровень {selectedChar.level}</p>
                </div>
              </div>

              <div className="px-6 space-y-4">
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 border-2 border-orange-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-700">Мощь:</span>
                    <span className="text-2xl font-black text-orange-600">⚡ {selectedChar.power.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-3 border-2 border-red-300">
                    <p className="text-xs font-bold text-gray-600">❤️ HP</p>
                    <p className="text-lg font-black text-red-600">{selectedChar.hp.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-3 border-2 border-orange-300">
                    <p className="text-xs font-bold text-gray-600">⚔️ Атака</p>
                    <p className="text-lg font-black text-orange-600">{selectedChar.attack.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3 border-2 border-blue-300">
                    <p className="text-xs font-bold text-gray-600">🛡️ Защита</p>
                    <p className="text-lg font-black text-blue-600">{selectedChar.defense.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-3 border-2 border-yellow-300">
                    <p className="text-xs font-bold text-gray-600">💥 Крит</p>
                    <p className="text-lg font-black text-yellow-600">{selectedChar.critRate}%</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Sparkles" className="text-purple-600" />
                    <span className="font-bold text-purple-800">Навык</span>
                  </div>
                  <p className="text-purple-900 font-black text-lg">{selectedChar.skill}</p>
                </div>

                {selectedChar.topping && selectedChar.topping.length > 0 && (
                  <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-4 border-2 border-green-300">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🍰</span>
                      <span className="font-bold text-green-800">Топпинги</span>
                    </div>
                    <div className="space-y-1">
                      {selectedChar.topping.map((top, i) => (
                        <Badge key={i} className="bg-white text-green-700 font-bold mr-2">
                          {top}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedChar.lovePartner && (
                  <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl p-4 border-2 border-pink-300">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💕</span>
                      <span className="font-bold text-pink-800">Особая связь</span>
                    </div>
                    <p className="text-pink-900 font-semibold">
                      {selectedChar.id === 10 
                        ? 'Связана крепкой дружбой с Тёмным Молоком. Вместе они непобедимы!' 
                        : 'Хранит особые чувства к Белой Лилии. Их связь делает обоих сильнее!'}
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-lg py-6 rounded-xl"
                  onClick={() => setSelectedChar(null)}
                >
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
