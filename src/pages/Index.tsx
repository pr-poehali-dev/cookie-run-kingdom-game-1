import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Level {
  id: number;
  name: string;
  difficulty: string;
  stars: number;
  reward: number;
  status: 'completed' | 'current' | 'locked';
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'characters' | 'levels'>('characters');
  const [coins, setCoins] = useState(350);
  const [playingLevel, setPlayingLevel] = useState<Level | null>(null);
  const [battleProgress, setBattleProgress] = useState(0);
  const [levels, setLevels] = useState<Level[]>([
    { id: 1, name: 'Сладкий Лес', difficulty: 'Легко', stars: 3, reward: 100, status: 'completed' },
    { id: 2, name: 'Шоколадная Гора', difficulty: 'Средне', stars: 2, reward: 200, status: 'completed' },
    { id: 3, name: 'Карамельная Пещера', difficulty: 'Средне', stars: 3, reward: 250, status: 'completed' },
    { id: 4, name: 'Королевство Желе', difficulty: 'Сложно', stars: 1, reward: 300, status: 'current' },
    { id: 5, name: 'Башня Тьмы', difficulty: 'Очень сложно', stars: 0, reward: 500, status: 'locked' },
    { id: 6, name: 'Ледяная Пустыня', difficulty: 'Сложно', stars: 0, reward: 350, status: 'locked' },
    { id: 7, name: 'Огненный Вулкан', difficulty: 'Очень сложно', stars: 0, reward: 600, status: 'locked' },
    { id: 8, name: 'Облачный Замок', difficulty: 'Средне', stars: 0, reward: 400, status: 'locked' },
  ]);

  const characters = [
    { id: 1, name: 'Храброе Печенье', rarity: 5, role: 'Атакующий', image: '🍪', color: 'from-orange-400 to-amber-600' },
    { id: 2, name: 'Клубничное Печенье', rarity: 4, role: 'Целитель', image: '🍓', color: 'from-pink-400 to-rose-600' },
    { id: 3, name: 'Шоколадное Печенье', rarity: 5, role: 'Защитник', image: '🍫', color: 'from-amber-700 to-orange-900' },
    { id: 4, name: 'Морское Печенье', rarity: 3, role: 'Поддержка', image: '🌊', color: 'from-blue-400 to-cyan-600' },
    { id: 5, name: 'Радужное Печенье', rarity: 5, role: 'Магия', image: '🌈', color: 'from-purple-400 to-pink-600' },
    { id: 6, name: 'Ванильное Печенье', rarity: 4, role: 'Атакующий', image: '🥛', color: 'from-yellow-200 to-amber-400' },
    { id: 7, name: 'Ледяное Печенье', rarity: 5, role: 'Магия', image: '❄️', color: 'from-cyan-300 to-blue-500' },
    { id: 8, name: 'Огненное Печенье', rarity: 5, role: 'Атакующий', image: '🔥', color: 'from-red-500 to-orange-600' },
    { id: 9, name: 'Лимонное Печенье', rarity: 3, role: 'Поддержка', image: '🍋', color: 'from-yellow-300 to-lime-400' },
    { id: 10, name: 'Королевское Печенье', rarity: 5, role: 'Защитник', image: '👑', color: 'from-purple-600 to-indigo-800' },
    { id: 11, name: 'Ночное Печенье', rarity: 4, role: 'Магия', image: '🌙', color: 'from-indigo-600 to-purple-900' },
    { id: 12, name: 'Кокосовое Печенье', rarity: 3, role: 'Целитель', image: '🥥', color: 'from-amber-200 to-stone-400' },
    { id: 13, name: 'Виноградное Печенье', rarity: 4, role: 'Атакующий', image: '🍇', color: 'from-purple-400 to-violet-600' },
    { id: 14, name: 'Драконье Печенье', rarity: 5, role: 'Магия', image: '🐉', color: 'from-emerald-500 to-teal-700' },
    { id: 15, name: 'Звездное Печенье', rarity: 5, role: 'Поддержка', image: '⭐', color: 'from-yellow-400 to-amber-600' },
  ];

  const playLevel = (level: Level) => {
    if (level.status === 'locked') return;
    
    setPlayingLevel(level);
    setBattleProgress(0);
    
    const interval = setInterval(() => {
      setBattleProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completeLevel(level);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const completeLevel = (level: Level) => {
    setTimeout(() => {
      const earnedStars = Math.floor(Math.random() * 3) + 1;
      const newCoins = coins + level.reward;
      setCoins(newCoins);
      
      setLevels((prevLevels) => {
        const updatedLevels = prevLevels.map((l) => {
          if (l.id === level.id) {
            return { ...l, stars: Math.max(l.stars, earnedStars), status: 'completed' as const };
          }
          if (l.id === level.id + 1 && l.status === 'locked') {
            return { ...l, status: 'current' as const };
          }
          return l;
        });
        return updatedLevels;
      });
      
      toast.success(`Уровень пройден! +${level.reward} монет`, {
        description: `Получено звёзд: ${earnedStars}/3`,
      });
      
      setPlayingLevel(null);
      setBattleProgress(0);
    }, 500);
  };

  const renderStars = (count: number, max: number = 5) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(max)].map((_, i) => (
          <span key={i} className={i < count ? 'text-yellow-400' : 'text-gray-400'}>
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-6xl font-bold mb-2 cookie-title">
            COOKIE RUN KINGDOM
          </h1>
          <p className="text-white text-xl font-semibold drop-shadow-lg">Собери всех героев и пройди все уровни!</p>
          
          <div className="mt-4 inline-flex items-center gap-2 bg-white/90 px-6 py-3 rounded-full shadow-lg">
            <Icon name="Coins" size={28} className="text-yellow-500" />
            <span className="text-2xl font-bold text-purple-800">{coins}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setActiveTab('characters')}
            className={`px-8 py-6 text-lg font-bold rounded-full transition-all ${
              activeTab === 'characters'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-105'
                : 'bg-white/80 text-purple-700 hover:scale-105'
            }`}
          >
            <Icon name="Users" className="mr-2" size={24} />
            Персонажи
          </Button>
          <Button
            onClick={() => setActiveTab('levels')}
            className={`px-8 py-6 text-lg font-bold rounded-full transition-all ${
              activeTab === 'levels'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-105'
                : 'bg-white/80 text-purple-700 hover:scale-105'
            }`}
          >
            <Icon name="Map" className="mr-2" size={24} />
            Уровни
          </Button>
        </div>

        {activeTab === 'characters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {characters.map((char) => (
              <Card key={char.id} className="overflow-hidden hover:scale-105 transition-transform cursor-pointer border-4 border-white/50 shadow-2xl">
                <div className={`bg-gradient-to-br ${char.color} p-6 text-center`}>
                  <div className="text-8xl mb-4 animate-bounce">{char.image}</div>
                  <div className="flex justify-center mb-2">
                    {renderStars(char.rarity)}
                  </div>
                </div>
                <CardContent className="bg-white/95 p-4">
                  <h3 className="text-xl font-bold text-purple-800 mb-2 text-center">{char.name}</h3>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold">
                      {char.role}
                    </Badge>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-full">
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'levels' && (
          <div className="space-y-4 animate-fade-in max-w-3xl mx-auto">
            {levels.map((level) => (
              <Card key={level.id} className={`overflow-hidden border-4 border-white/50 shadow-xl hover:scale-102 transition-transform ${
                level.status === 'locked' ? 'opacity-60' : ''
              }`}>
                <CardContent className="bg-white/95 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                        level.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-emerald-600' :
                        level.status === 'current' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        'bg-gray-400'
                      }`}>
                        {level.status === 'locked' ? '🔒' : '🏰'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-purple-800 mb-1">{level.name}</h3>
                        <div className="flex gap-3 items-center flex-wrap">
                          <Badge className={`font-bold ${
                            level.difficulty === 'Легко' ? 'bg-green-500' :
                            level.difficulty === 'Средне' ? 'bg-yellow-500' :
                            level.difficulty === 'Сложно' ? 'bg-orange-500' :
                            'bg-red-600'
                          }`}>
                            {level.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-600 font-semibold">
                            <Icon name="Coins" className="inline mr-1" size={16} />
                            {level.reward} монет
                          </span>
                        </div>
                        <div className="mt-2">
                          {renderStars(level.stars, 3)}
                        </div>
                      </div>
                    </div>
                    <Button 
                      disabled={level.status === 'locked'}
                      onClick={() => playLevel(level)}
                      className={`px-6 py-3 rounded-full font-bold ${
                        level.status === 'locked' 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                      }`}
                    >
                      {level.status === 'locked' ? 'Заблокировано' : 
                       level.status === 'completed' ? 'Пройти снова' : 
                       'Играть'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!playingLevel} onOpenChange={() => setPlayingLevel(null)}>
        <DialogContent className="bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-white text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center mb-4">
              {playingLevel?.name}
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
    </div>
  );
};

export default Index;
