const EXERCISES = [
  
  {
    '1': [
      { 
        name: 'Присяд зі штангою',
        alternatives: ['Жим платформи']
      },
      { name: 'Румунська тяга з гантелями' },
      { name: 'Болгарські випади' },
      { name: 'Відведення ноги у кросовері' },
      { name: 'Розведення ніг в тренажері',
        alternatives: ['Зведення ніг в тренажері']
      },
      { name: 'Ягодичний міст із штангою' },
    ],
    '2': [
      { name: 'T-Тяга' },
      { name: 'Вертикальна тяга', 
        alternatives: ['Зворотній хамер']
       },
      { name: 'Тяга горизонтального блоку до поясу' },
      { name: 'Жим гантелей сидячи' },
      { name: 'Тяга в нахилі' },
      { name: 'Молотки з гантелями на біцепс' },
      { name: 'Кросовер на трицепс' }
    ],
    'cardio': [
      { name: 'Інтервальне кардіо: біг/ходьба' },
      { name: 'Прес 1' }, 
      { name: 'Прес 2' },
      { name: 'Прес 3' },
      { name: 'Планка (прямі, лікті)' }
    ]
  },

  {
    '1': [
      { 
        name: 'Присідання зі штангою',
      },
      { name: 'Розгинання ніг' },
      { name: 'Згинання ніг' },
      { name: 'Зведення ніг' },
      { name: 'Ікри' },
      { name: 'Кисть в блоці' },
      { name: 'Кисть гантеля' },
      { name: 'Кисть блін' }
    ],
    '2': [
      { name: 'Станова тяга' },
      { name: 'Горизонтальна тяга' },
      { name: 'Ричаги' },
      { name: 'Тяга в нахилі' },
      { name: 'Тяга Хамери',
        alternatives: ['Вертикальна тяга']
       },
      { name: 'Гіперекстензія' }
    ],
    '3': [
      { name: 'Жим гантель сидячи',
        alternatives: ['Жим в тренажері', 'Жим штанги стоячи']
       },
      { name: 'Розведення рук за спиною (метелик)',
        alternatives: ['Розведення рук за спиною сидячи']
       },
      { name: 'Розведення рук стоячи' },
      { name: 'Тяга до підборіддя' },
      { name: 'Підйом штанги на біцепс' },
      { name: 'Підйом гантель на біцепс' },
      { name: 'Біцепс в блоці' },
    ],
    '4': [
      { name: 'Жим' },
      { name: 'Жим головою вгору' },
      { name: 'Жим гантель на лавці' },
      { name: 'Розведення гантель' },
      { name: 'Французький жим' },
      { name: 'Трицепс в блоці' }
    ]
  }
];

export default EXERCISES;
