import type { DataSet } from '@/types/data_set'

export const pimaIndiansDiabetes: DataSet = {
  name: 'Pima Indians Diabetes',
  description:
    'The Pima Indians Diabetes data set involves predicting the onset of diabetes within 5 years in Pima Indians given medical details. It is a binary (2-class) classification problem. The number of observations for each class is not balanced. There are 768 observations with 8 input variables and 1 output variable. Missing values are believed to be encoded with zero values.',
  type: 'classification',
  featureDescs: [
    {
      key: 'PREG',
      description: 'Number of times pregnant',
    },
    {
      key: 'GLUC',
      description:
        'Plasma glucose concentration a 2 hours in an oral glucose tolerance test.',
    },
    {
      key: 'BLOOD',
      description: 'Diastolic blood pressure (mm Hg)',
    },
    {
      key: 'SKIN',
      description: 'Triceps skinfold thickness (mm)',
    },
    {
      key: 'INS',
      description: '2-Hour serum insulin (mu U/ml)',
    },
    {
      key: 'BMI',
      description: 'Body mass index (weight in kg/(height in m)^2)',
    },
    {
      key: 'PEDI',
      description: 'Diabetes pedigree function',
    },
    {
      key: 'AGE',
      description: 'Age (years)',
    },
  ],
  labelDesc: {
    key: 'DIA',
    description: 'Diabetes',
    classes: [
      {
        id: 0,
        description: 'No',
      },
      {
        id: 1,
        description: 'Yes',
      },
    ],
  },
  data: [
    {
      features: [6, 148, 72, 35, 0, 33, 0, 50],
      label: 1,
    },
    {
      features: [1, 85, 66, 29, 0, 26, 0, 31],
      label: 0,
    },
    {
      features: [8, 183, 64, 0, 0, 23, 0, 32],
      label: 1,
    },
    {
      features: [1, 89, 66, 23, 94, 28, 0, 21],
      label: 0,
    },
    {
      features: [0, 137, 40, 35, 168, 43, 2, 33],
      label: 1,
    },
    {
      features: [5, 116, 74, 0, 0, 25, 0, 30],
      label: 0,
    },
    {
      features: [3, 78, 50, 32, 88, 31, 0, 26],
      label: 1,
    },
    {
      features: [10, 115, 0, 0, 0, 35, 0, 29],
      label: 0,
    },
    {
      features: [2, 197, 70, 45, 543, 30, 0, 53],
      label: 1,
    },
    {
      features: [8, 125, 96, 0, 0, 0, 0, 54],
      label: 1,
    },
    {
      features: [4, 110, 92, 0, 0, 37, 0, 30],
      label: 0,
    },
    {
      features: [10, 168, 74, 0, 0, 38, 0, 34],
      label: 1,
    },
    {
      features: [10, 139, 80, 0, 0, 27, 1, 57],
      label: 0,
    },
    {
      features: [1, 189, 60, 23, 846, 30, 0, 59],
      label: 1,
    },
    {
      features: [5, 166, 72, 19, 175, 25, 0, 51],
      label: 1,
    },
    {
      features: [7, 100, 0, 0, 0, 30, 0, 32],
      label: 1,
    },
    {
      features: [0, 118, 84, 47, 230, 45, 0, 31],
      label: 1,
    },
    {
      features: [7, 107, 74, 0, 0, 29, 0, 31],
      label: 1,
    },
    {
      features: [1, 103, 30, 38, 83, 43, 0, 33],
      label: 0,
    },
    {
      features: [1, 115, 70, 30, 96, 34, 0, 32],
      label: 1,
    },
    {
      features: [3, 126, 88, 41, 235, 39, 0, 27],
      label: 0,
    },
    {
      features: [8, 99, 84, 0, 0, 35, 0, 50],
      label: 0,
    },
    {
      features: [7, 196, 90, 0, 0, 39, 0, 41],
      label: 1,
    },
    {
      features: [9, 119, 80, 35, 0, 29, 0, 29],
      label: 1,
    },
    {
      features: [11, 143, 94, 33, 146, 36, 0, 51],
      label: 1,
    },
    {
      features: [10, 125, 70, 26, 115, 31, 0, 41],
      label: 1,
    },
    {
      features: [7, 147, 76, 0, 0, 39, 0, 43],
      label: 1,
    },
    {
      features: [1, 97, 66, 15, 140, 23, 0, 22],
      label: 0,
    },
    {
      features: [13, 145, 82, 19, 110, 22, 0, 57],
      label: 0,
    },
    {
      features: [5, 117, 92, 0, 0, 34, 0, 38],
      label: 0,
    },
    {
      features: [5, 109, 75, 26, 0, 36, 0, 60],
      label: 0,
    },
    {
      features: [3, 158, 76, 36, 245, 31, 0, 28],
      label: 1,
    },
    {
      features: [3, 88, 58, 11, 54, 24, 0, 22],
      label: 0,
    },
    {
      features: [6, 92, 92, 0, 0, 19, 0, 28],
      label: 0,
    },
    {
      features: [10, 122, 78, 31, 0, 27, 0, 45],
      label: 0,
    },
    {
      features: [4, 103, 60, 33, 192, 24, 0, 33],
      label: 0,
    },
    {
      features: [11, 138, 76, 0, 0, 33, 0, 35],
      label: 0,
    },
    {
      features: [9, 102, 76, 37, 0, 32, 0, 46],
      label: 1,
    },
    {
      features: [2, 90, 68, 42, 0, 38, 0, 27],
      label: 1,
    },
    {
      features: [4, 111, 72, 47, 207, 37, 1, 56],
      label: 1,
    },
    {
      features: [3, 180, 64, 25, 70, 34, 0, 26],
      label: 0,
    },
    {
      features: [7, 133, 84, 0, 0, 40, 0, 37],
      label: 0,
    },
    {
      features: [7, 106, 92, 18, 0, 22, 0, 48],
      label: 0,
    },
    {
      features: [9, 171, 110, 24, 240, 45, 0, 54],
      label: 1,
    },
    {
      features: [7, 159, 64, 0, 0, 27, 0, 40],
      label: 0,
    },
    {
      features: [0, 180, 66, 39, 0, 42, 1, 25],
      label: 1,
    },
    {
      features: [1, 146, 56, 0, 0, 29, 0, 29],
      label: 0,
    },
    {
      features: [2, 71, 70, 27, 0, 28, 0, 22],
      label: 0,
    },
    {
      features: [7, 103, 66, 32, 0, 39, 0, 31],
      label: 1,
    },
    {
      features: [7, 105, 0, 0, 0, 0, 0, 24],
      label: 0,
    },
    {
      features: [1, 103, 80, 11, 82, 19, 0, 22],
      label: 0,
    },
    {
      features: [1, 101, 50, 15, 36, 24, 0, 26],
      label: 0,
    },
    {
      features: [5, 88, 66, 21, 23, 24, 0, 30],
      label: 0,
    },
    {
      features: [8, 176, 90, 34, 300, 33, 0, 58],
      label: 1,
    },
    {
      features: [7, 150, 66, 42, 342, 34, 0, 42],
      label: 0,
    },
    {
      features: [1, 73, 50, 10, 0, 23, 0, 21],
      label: 0,
    },
    {
      features: [7, 187, 68, 39, 304, 37, 0, 41],
      label: 1,
    },
    {
      features: [0, 100, 88, 60, 110, 46, 0, 31],
      label: 0,
    },
    {
      features: [0, 146, 82, 0, 0, 40, 1, 44],
      label: 0,
    },
    {
      features: [0, 105, 64, 41, 142, 41, 0, 22],
      label: 0,
    },
    {
      features: [2, 84, 0, 0, 0, 0, 0, 21],
      label: 0,
    },
    {
      features: [8, 133, 72, 0, 0, 32, 0, 39],
      label: 1,
    },
    {
      features: [5, 44, 62, 0, 0, 25, 0, 36],
      label: 0,
    },
    {
      features: [2, 141, 58, 34, 128, 25, 0, 24],
      label: 0,
    },
    {
      features: [7, 114, 66, 0, 0, 32, 0, 42],
      label: 1,
    },
    {
      features: [5, 99, 74, 27, 0, 29, 0, 32],
      label: 0,
    },
    {
      features: [0, 109, 88, 30, 0, 32, 0, 38],
      label: 1,
    },
    {
      features: [2, 109, 92, 0, 0, 42, 0, 54],
      label: 0,
    },
    {
      features: [1, 95, 66, 13, 38, 19, 0, 25],
      label: 0,
    },
    {
      features: [4, 146, 85, 27, 100, 28, 0, 27],
      label: 0,
    },
    {
      features: [2, 100, 66, 20, 90, 32, 0, 28],
      label: 1,
    },
    {
      features: [5, 139, 64, 35, 140, 28, 0, 26],
      label: 0,
    },
    {
      features: [13, 126, 90, 0, 0, 43, 0, 42],
      label: 1,
    },
    {
      features: [4, 129, 86, 20, 270, 35, 0, 23],
      label: 0,
    },
    {
      features: [1, 79, 75, 30, 0, 32, 0, 22],
      label: 0,
    },
    {
      features: [1, 0, 48, 20, 0, 24, 0, 22],
      label: 0,
    },
    {
      features: [7, 62, 78, 0, 0, 32, 0, 41],
      label: 0,
    },
    {
      features: [5, 95, 72, 33, 0, 37, 0, 27],
      label: 0,
    },
    {
      features: [0, 131, 0, 0, 0, 43, 0, 26],
      label: 1,
    },
    {
      features: [2, 112, 66, 22, 0, 25, 0, 24],
      label: 0,
    },
    {
      features: [3, 113, 44, 13, 0, 22, 0, 22],
      label: 0,
    },
    {
      features: [2, 74, 0, 0, 0, 0, 0, 22],
      label: 0,
    },
    {
      features: [7, 83, 78, 26, 71, 29, 0, 36],
      label: 0,
    },
    {
      features: [0, 101, 65, 28, 0, 24, 0, 22],
      label: 0,
    },
    {
      features: [5, 137, 108, 0, 0, 48, 0, 37],
      label: 1,
    },
    {
      features: [2, 110, 74, 29, 125, 32, 0, 27],
      label: 0,
    },
    {
      features: [13, 106, 72, 54, 0, 36, 0, 45],
      label: 0,
    },
    {
      features: [2, 100, 68, 25, 71, 38, 0, 26],
      label: 0,
    },
    {
      features: [15, 136, 70, 32, 110, 37, 0, 43],
      label: 1,
    },
    {
      features: [1, 107, 68, 19, 0, 26, 0, 24],
      label: 0,
    },
    {
      features: [1, 80, 55, 0, 0, 19, 0, 21],
      label: 0,
    },
    {
      features: [4, 123, 80, 15, 176, 32, 0, 34],
      label: 0,
    },
    {
      features: [7, 81, 78, 40, 48, 46, 0, 42],
      label: 0,
    },
    {
      features: [4, 134, 72, 0, 0, 23, 0, 60],
      label: 1,
    },
    {
      features: [2, 142, 82, 18, 64, 24, 0, 21],
      label: 0,
    },
    {
      features: [6, 144, 72, 27, 228, 33, 0, 40],
      label: 0,
    },
    {
      features: [2, 92, 62, 28, 0, 31, 0, 24],
      label: 0,
    },
    {
      features: [1, 71, 48, 18, 76, 20, 0, 22],
      label: 0,
    },
    {
      features: [6, 93, 50, 30, 64, 28, 0, 23],
      label: 0,
    },
    {
      features: [1, 122, 90, 51, 220, 49, 0, 31],
      label: 1,
    },
    {
      features: [1, 163, 72, 0, 0, 39, 1, 33],
      label: 1,
    },
    {
      features: [1, 151, 60, 0, 0, 26, 0, 22],
      label: 0,
    },
    {
      features: [0, 125, 96, 0, 0, 22, 0, 21],
      label: 0,
    },
    {
      features: [1, 81, 72, 18, 40, 26, 0, 24],
      label: 0,
    },
    {
      features: [2, 85, 65, 0, 0, 39, 0, 27],
      label: 0,
    },
    {
      features: [1, 126, 56, 29, 152, 28, 0, 21],
      label: 0,
    },
    {
      features: [1, 96, 122, 0, 0, 22, 0, 27],
      label: 0,
    },
    {
      features: [4, 144, 58, 28, 140, 29, 0, 37],
      label: 0,
    },
    {
      features: [3, 83, 58, 31, 18, 34, 0, 25],
      label: 0,
    },
    {
      features: [0, 95, 85, 25, 36, 37, 0, 24],
      label: 1,
    },
    {
      features: [3, 171, 72, 33, 135, 33, 0, 24],
      label: 1,
    },
    {
      features: [8, 155, 62, 26, 495, 34, 0, 46],
      label: 1,
    },
    {
      features: [1, 89, 76, 34, 37, 31, 0, 23],
      label: 0,
    },
    {
      features: [4, 76, 62, 0, 0, 34, 0, 25],
      label: 0,
    },
    {
      features: [7, 160, 54, 32, 175, 30, 0, 39],
      label: 1,
    },
    {
      features: [4, 146, 92, 0, 0, 31, 0, 61],
      label: 1,
    },
    {
      features: [5, 124, 74, 0, 0, 34, 0, 38],
      label: 1,
    },
    {
      features: [5, 78, 48, 0, 0, 33, 0, 25],
      label: 0,
    },
    {
      features: [4, 97, 60, 23, 0, 28, 0, 22],
      label: 0,
    },
    {
      features: [4, 99, 76, 15, 51, 23, 0, 21],
      label: 0,
    },
    {
      features: [0, 162, 76, 56, 100, 53, 0, 25],
      label: 1,
    },
    {
      features: [6, 111, 64, 39, 0, 34, 0, 24],
      label: 0,
    },
    {
      features: [2, 107, 74, 30, 100, 33, 0, 23],
      label: 0,
    },
    {
      features: [5, 132, 80, 0, 0, 26, 0, 69],
      label: 0,
    },
    {
      features: [0, 113, 76, 0, 0, 33, 0, 23],
      label: 1,
    },
    {
      features: [1, 88, 30, 42, 99, 55, 0, 26],
      label: 1,
    },
    {
      features: [3, 120, 70, 30, 135, 42, 0, 30],
      label: 0,
    },
    {
      features: [1, 118, 58, 36, 94, 33, 0, 23],
      label: 0,
    },
    {
      features: [1, 117, 88, 24, 145, 34, 0, 40],
      label: 1,
    },
    {
      features: [0, 105, 84, 0, 0, 27, 0, 62],
      label: 1,
    },
    {
      features: [4, 173, 70, 14, 168, 29, 0, 33],
      label: 1,
    },
    {
      features: [9, 122, 56, 0, 0, 33, 1, 33],
      label: 1,
    },
    {
      features: [3, 170, 64, 37, 225, 34, 0, 30],
      label: 1,
    },
    {
      features: [8, 84, 74, 31, 0, 38, 0, 39],
      label: 0,
    },
    {
      features: [2, 96, 68, 13, 49, 21, 0, 26],
      label: 0,
    },
    {
      features: [2, 125, 60, 20, 140, 33, 0, 31],
      label: 0,
    },
    {
      features: [0, 100, 70, 26, 50, 30, 0, 21],
      label: 0,
    },
    {
      features: [0, 93, 60, 25, 92, 28, 0, 22],
      label: 0,
    },
    {
      features: [0, 129, 80, 0, 0, 31, 0, 29],
      label: 0,
    },
    {
      features: [5, 105, 72, 29, 325, 36, 0, 28],
      label: 0,
    },
    {
      features: [3, 128, 78, 0, 0, 21, 0, 55],
      label: 0,
    },
    {
      features: [5, 106, 82, 30, 0, 39, 0, 38],
      label: 0,
    },
    {
      features: [2, 108, 52, 26, 63, 32, 0, 22],
      label: 0,
    },
    {
      features: [10, 108, 66, 0, 0, 32, 0, 42],
      label: 1,
    },
    {
      features: [4, 154, 62, 31, 284, 32, 0, 23],
      label: 0,
    },
    {
      features: [0, 102, 75, 23, 0, 0, 0, 21],
      label: 0,
    },
    {
      features: [9, 57, 80, 37, 0, 32, 0, 41],
      label: 0,
    },
    {
      features: [2, 106, 64, 35, 119, 30, 1, 34],
      label: 0,
    },
    {
      features: [5, 147, 78, 0, 0, 33, 0, 65],
      label: 0,
    },
    {
      features: [2, 90, 70, 17, 0, 27, 0, 22],
      label: 0,
    },
    {
      features: [1, 136, 74, 50, 204, 37, 0, 24],
      label: 0,
    },
    {
      features: [4, 114, 65, 0, 0, 21, 0, 37],
      label: 0,
    },
    {
      features: [9, 156, 86, 28, 155, 34, 1, 42],
      label: 1,
    },
    {
      features: [1, 153, 82, 42, 485, 40, 0, 23],
      label: 0,
    },
    {
      features: [8, 188, 78, 0, 0, 47, 0, 43],
      label: 1,
    },
    {
      features: [7, 152, 88, 44, 0, 50, 0, 36],
      label: 1,
    },
    {
      features: [2, 99, 52, 15, 94, 24, 0, 21],
      label: 0,
    },
    {
      features: [1, 109, 56, 21, 135, 25, 0, 23],
      label: 0,
    },
    {
      features: [2, 88, 74, 19, 53, 29, 0, 22],
      label: 0,
    },
    {
      features: [17, 163, 72, 41, 114, 40, 0, 47],
      label: 1,
    },
    {
      features: [4, 151, 90, 38, 0, 29, 0, 36],
      label: 0,
    },
    {
      features: [7, 102, 74, 40, 105, 37, 0, 45],
      label: 0,
    },
    {
      features: [0, 114, 80, 34, 285, 44, 0, 27],
      label: 0,
    },
    {
      features: [2, 100, 64, 23, 0, 29, 0, 21],
      label: 0,
    },
    {
      features: [0, 131, 88, 0, 0, 31, 0, 32],
      label: 1,
    },
    {
      features: [6, 104, 74, 18, 156, 29, 0, 41],
      label: 1,
    },
    {
      features: [3, 148, 66, 25, 0, 32, 0, 22],
      label: 0,
    },
    {
      features: [4, 120, 68, 0, 0, 29, 0, 34],
      label: 0,
    },
    {
      features: [4, 110, 66, 0, 0, 31, 0, 29],
      label: 0,
    },
    {
      features: [3, 111, 90, 12, 78, 28, 0, 29],
      label: 0,
    },
    {
      features: [6, 102, 82, 0, 0, 30, 0, 36],
      label: 1,
    },
    {
      features: [6, 134, 70, 23, 130, 35, 0, 29],
      label: 1,
    },
    {
      features: [2, 87, 0, 23, 0, 28, 0, 25],
      label: 0,
    },
    {
      features: [1, 79, 60, 42, 48, 43, 0, 23],
      label: 0,
    },
    {
      features: [2, 75, 64, 24, 55, 29, 0, 33],
      label: 0,
    },
    {
      features: [8, 179, 72, 42, 130, 32, 0, 36],
      label: 1,
    },
    {
      features: [6, 85, 78, 0, 0, 31, 0, 42],
      label: 0,
    },
    {
      features: [0, 129, 110, 46, 130, 67, 0, 26],
      label: 1,
    },
    {
      features: [5, 143, 78, 0, 0, 45, 0, 47],
      label: 0,
    },
    {
      features: [5, 130, 82, 0, 0, 39, 0, 37],
      label: 1,
    },
    {
      features: [6, 87, 80, 0, 0, 23, 0, 32],
      label: 0,
    },
    {
      features: [0, 119, 64, 18, 92, 34, 0, 23],
      label: 0,
    },
    {
      features: [1, 0, 74, 20, 23, 27, 0, 21],
      label: 0,
    },
    {
      features: [5, 73, 60, 0, 0, 26, 0, 27],
      label: 0,
    },
    {
      features: [4, 141, 74, 0, 0, 27, 0, 40],
      label: 0,
    },
    {
      features: [7, 194, 68, 28, 0, 35, 0, 41],
      label: 1,
    },
    {
      features: [8, 181, 68, 36, 495, 30, 0, 60],
      label: 1,
    },
    {
      features: [1, 128, 98, 41, 58, 32, 1, 33],
      label: 1,
    },
    {
      features: [8, 109, 76, 39, 114, 27, 0, 31],
      label: 1,
    },
    {
      features: [5, 139, 80, 35, 160, 31, 0, 25],
      label: 1,
    },
    {
      features: [3, 111, 62, 0, 0, 22, 0, 21],
      label: 0,
    },
    {
      features: [9, 123, 70, 44, 94, 33, 0, 40],
      label: 0,
    },
    {
      features: [7, 159, 66, 0, 0, 30, 0, 36],
      label: 1,
    },
    {
      features: [11, 135, 0, 0, 0, 52, 0, 40],
      label: 1,
    },
    {
      features: [8, 85, 55, 20, 0, 24, 0, 42],
      label: 0,
    },
    {
      features: [5, 158, 84, 41, 210, 39, 0, 29],
      label: 1,
    },
    {
      features: [1, 105, 58, 0, 0, 24, 0, 21],
      label: 0,
    },
    {
      features: [3, 107, 62, 13, 48, 22, 0, 23],
      label: 1,
    },
    {
      features: [4, 109, 64, 44, 99, 34, 0, 26],
      label: 1,
    },
    {
      features: [4, 148, 60, 27, 318, 30, 0, 29],
      label: 1,
    },
    {
      features: [0, 113, 80, 16, 0, 31, 0, 21],
      label: 0,
    },
    {
      features: [1, 138, 82, 0, 0, 40, 0, 28],
      label: 0,
    },
    {
      features: [0, 108, 68, 20, 0, 27, 0, 32],
      label: 0,
    },
    {
      features: [2, 99, 70, 16, 44, 20, 0, 27],
      label: 0,
    },
    {
      features: [6, 103, 72, 32, 190, 37, 0, 55],
      label: 0,
    },
    {
      features: [5, 111, 72, 28, 0, 23, 0, 27],
      label: 0,
    },
    {
      features: [8, 196, 76, 29, 280, 37, 0, 57],
      label: 1,
    },
    {
      features: [5, 162, 104, 0, 0, 37, 0, 52],
      label: 1,
    },
    {
      features: [1, 96, 64, 27, 87, 33, 0, 21],
      label: 0,
    },
    {
      features: [7, 184, 84, 33, 0, 35, 0, 41],
      label: 1,
    },
    {
      features: [2, 81, 60, 22, 0, 27, 0, 25],
      label: 0,
    },
    {
      features: [0, 147, 85, 54, 0, 42, 0, 24],
      label: 0,
    },
    {
      features: [7, 179, 95, 31, 0, 34, 0, 60],
      label: 0,
    },
    {
      features: [0, 140, 65, 26, 130, 42, 0, 24],
      label: 1,
    },
    {
      features: [9, 112, 82, 32, 175, 34, 0, 36],
      label: 1,
    },
    {
      features: [12, 151, 70, 40, 271, 41, 0, 38],
      label: 1,
    },
    {
      features: [5, 109, 62, 41, 129, 35, 0, 25],
      label: 1,
    },
    {
      features: [6, 125, 68, 30, 120, 30, 0, 32],
      label: 0,
    },
    {
      features: [5, 85, 74, 22, 0, 29, 1, 32],
      label: 1,
    },
    {
      features: [5, 112, 66, 0, 0, 37, 0, 41],
      label: 1,
    },
    {
      features: [0, 177, 60, 29, 478, 34, 1, 21],
      label: 1,
    },
    {
      features: [2, 158, 90, 0, 0, 31, 0, 66],
      label: 1,
    },
    {
      features: [7, 119, 0, 0, 0, 25, 0, 37],
      label: 0,
    },
    {
      features: [7, 142, 60, 33, 190, 28, 0, 61],
      label: 0,
    },
    {
      features: [1, 100, 66, 15, 56, 23, 0, 26],
      label: 0,
    },
    {
      features: [1, 87, 78, 27, 32, 34, 0, 22],
      label: 0,
    },
    {
      features: [0, 101, 76, 0, 0, 35, 0, 26],
      label: 0,
    },
    {
      features: [3, 162, 52, 38, 0, 37, 0, 24],
      label: 1,
    },
    {
      features: [4, 197, 70, 39, 744, 36, 2, 31],
      label: 0,
    },
    {
      features: [0, 117, 80, 31, 53, 45, 0, 24],
      label: 0,
    },
    {
      features: [4, 142, 86, 0, 0, 44, 0, 22],
      label: 1,
    },
    {
      features: [6, 134, 80, 37, 370, 46, 0, 46],
      label: 1,
    },
    {
      features: [1, 79, 80, 25, 37, 25, 0, 22],
      label: 0,
    },
    {
      features: [4, 122, 68, 0, 0, 35, 0, 29],
      label: 0,
    },
    {
      features: [3, 74, 68, 28, 45, 29, 0, 23],
      label: 0,
    },
    {
      features: [4, 171, 72, 0, 0, 43, 0, 26],
      label: 1,
    },
    {
      features: [7, 181, 84, 21, 192, 35, 0, 51],
      label: 1,
    },
    {
      features: [0, 179, 90, 27, 0, 44, 0, 23],
      label: 1,
    },
    {
      features: [9, 164, 84, 21, 0, 30, 0, 32],
      label: 1,
    },
    {
      features: [0, 104, 76, 0, 0, 18, 0, 27],
      label: 0,
    },
    {
      features: [1, 91, 64, 24, 0, 29, 0, 21],
      label: 0,
    },
    {
      features: [4, 91, 70, 32, 88, 33, 0, 22],
      label: 0,
    },
    {
      features: [3, 139, 54, 0, 0, 25, 0, 22],
      label: 1,
    },
    {
      features: [6, 119, 50, 22, 176, 27, 1, 33],
      label: 1,
    },
    {
      features: [2, 146, 76, 35, 194, 38, 0, 29],
      label: 0,
    },
    {
      features: [9, 184, 85, 15, 0, 30, 1, 49],
      label: 1,
    },
    {
      features: [10, 122, 68, 0, 0, 31, 0, 41],
      label: 0,
    },
    {
      features: [0, 165, 90, 33, 680, 52, 0, 23],
      label: 0,
    },
    {
      features: [9, 124, 70, 33, 402, 35, 0, 34],
      label: 0,
    },
    {
      features: [1, 111, 86, 19, 0, 30, 0, 23],
      label: 0,
    },
    {
      features: [9, 106, 52, 0, 0, 31, 0, 42],
      label: 0,
    },
    {
      features: [2, 129, 84, 0, 0, 28, 0, 27],
      label: 0,
    },
    {
      features: [2, 90, 80, 14, 55, 24, 0, 24],
      label: 0,
    },
    {
      features: [0, 86, 68, 32, 0, 35, 0, 25],
      label: 0,
    },
    {
      features: [12, 92, 62, 7, 258, 27, 0, 44],
      label: 1,
    },
    {
      features: [1, 113, 64, 35, 0, 33, 0, 21],
      label: 1,
    },
    {
      features: [3, 111, 56, 39, 0, 30, 0, 30],
      label: 0,
    },
    {
      features: [2, 114, 68, 22, 0, 28, 0, 25],
      label: 0,
    },
    {
      features: [1, 193, 50, 16, 375, 25, 0, 24],
      label: 0,
    },
    {
      features: [11, 155, 76, 28, 150, 33, 1, 51],
      label: 1,
    },
    {
      features: [3, 191, 68, 15, 130, 30, 0, 34],
      label: 0,
    },
    {
      features: [3, 141, 0, 0, 0, 30, 0, 27],
      label: 1,
    },
    {
      features: [4, 95, 70, 32, 0, 32, 0, 24],
      label: 0,
    },
    {
      features: [3, 142, 80, 15, 0, 32, 0, 63],
      label: 0,
    },
    {
      features: [4, 123, 62, 0, 0, 32, 0, 35],
      label: 1,
    },
    {
      features: [5, 96, 74, 18, 67, 33, 0, 43],
      label: 0,
    },
    {
      features: [0, 138, 0, 0, 0, 36, 0, 25],
      label: 1,
    },
    {
      features: [2, 128, 64, 42, 0, 40, 1, 24],
      label: 0,
    },
    {
      features: [0, 102, 52, 0, 0, 25, 0, 21],
      label: 0,
    },
    {
      features: [2, 146, 0, 0, 0, 27, 0, 28],
      label: 1,
    },
    {
      features: [10, 101, 86, 37, 0, 45, 1, 38],
      label: 1,
    },
    {
      features: [2, 108, 62, 32, 56, 25, 0, 21],
      label: 0,
    },
    {
      features: [3, 122, 78, 0, 0, 23, 0, 40],
      label: 0,
    },
    {
      features: [1, 71, 78, 50, 45, 33, 0, 21],
      label: 0,
    },
    {
      features: [13, 106, 70, 0, 0, 34, 0, 52],
      label: 0,
    },
    {
      features: [2, 100, 70, 52, 57, 40, 0, 25],
      label: 0,
    },
    {
      features: [7, 106, 60, 24, 0, 26, 0, 29],
      label: 1,
    },
    {
      features: [0, 104, 64, 23, 116, 27, 0, 23],
      label: 0,
    },
    {
      features: [5, 114, 74, 0, 0, 24, 0, 57],
      label: 0,
    },
    {
      features: [2, 108, 62, 10, 278, 25, 0, 22],
      label: 0,
    },
    {
      features: [0, 146, 70, 0, 0, 37, 0, 28],
      label: 1,
    },
    {
      features: [10, 129, 76, 28, 122, 35, 0, 39],
      label: 0,
    },
    {
      features: [7, 133, 88, 15, 155, 32, 0, 37],
      label: 0,
    },
    {
      features: [7, 161, 86, 0, 0, 30, 0, 47],
      label: 1,
    },
    {
      features: [2, 108, 80, 0, 0, 27, 0, 52],
      label: 1,
    },
    {
      features: [7, 136, 74, 26, 135, 26, 0, 51],
      label: 0,
    },
    {
      features: [5, 155, 84, 44, 545, 38, 0, 34],
      label: 0,
    },
    {
      features: [1, 119, 86, 39, 220, 45, 0, 29],
      label: 1,
    },
    {
      features: [4, 96, 56, 17, 49, 20, 0, 26],
      label: 0,
    },
    {
      features: [5, 108, 72, 43, 75, 36, 0, 33],
      label: 0,
    },
    {
      features: [0, 78, 88, 29, 40, 36, 0, 21],
      label: 0,
    },
    {
      features: [0, 107, 62, 30, 74, 36, 0, 25],
      label: 1,
    },
    {
      features: [2, 128, 78, 37, 182, 43, 1, 31],
      label: 1,
    },
    {
      features: [1, 128, 48, 45, 194, 40, 0, 24],
      label: 1,
    },
    {
      features: [0, 161, 50, 0, 0, 21, 0, 65],
      label: 0,
    },
    {
      features: [6, 151, 62, 31, 120, 35, 0, 28],
      label: 0,
    },
    {
      features: [2, 146, 70, 38, 360, 28, 0, 29],
      label: 1,
    },
    {
      features: [0, 126, 84, 29, 215, 30, 0, 24],
      label: 0,
    },
    {
      features: [14, 100, 78, 25, 184, 36, 0, 46],
      label: 1,
    },
    {
      features: [8, 112, 72, 0, 0, 23, 0, 58],
      label: 0,
    },
    {
      features: [0, 167, 0, 0, 0, 32, 0, 30],
      label: 1,
    },
    {
      features: [2, 144, 58, 33, 135, 31, 0, 25],
      label: 1,
    },
    {
      features: [5, 77, 82, 41, 42, 35, 0, 35],
      label: 0,
    },
    {
      features: [5, 115, 98, 0, 0, 52, 0, 28],
      label: 1,
    },
    {
      features: [3, 150, 76, 0, 0, 21, 0, 37],
      label: 0,
    },
    {
      features: [2, 120, 76, 37, 105, 39, 0, 29],
      label: 0,
    },
    {
      features: [10, 161, 68, 23, 132, 25, 0, 47],
      label: 1,
    },
    {
      features: [0, 137, 68, 14, 148, 24, 0, 21],
      label: 0,
    },
    {
      features: [0, 128, 68, 19, 180, 30, 1, 25],
      label: 1,
    },
    {
      features: [2, 124, 68, 28, 205, 32, 0, 30],
      label: 1,
    },
    {
      features: [6, 80, 66, 30, 0, 26, 0, 41],
      label: 0,
    },
    {
      features: [0, 106, 70, 37, 148, 39, 0, 22],
      label: 0,
    },
    {
      features: [2, 155, 74, 17, 96, 26, 0, 27],
      label: 1,
    },
    {
      features: [3, 113, 50, 10, 85, 29, 0, 25],
      label: 0,
    },
    {
      features: [7, 109, 80, 31, 0, 35, 1, 43],
      label: 1,
    },
    {
      features: [2, 112, 68, 22, 94, 34, 0, 26],
      label: 0,
    },
    {
      features: [3, 99, 80, 11, 64, 19, 0, 30],
      label: 0,
    },
    {
      features: [3, 182, 74, 0, 0, 30, 0, 29],
      label: 1,
    },
    {
      features: [3, 115, 66, 39, 140, 38, 0, 28],
      label: 0,
    },
    {
      features: [6, 194, 78, 0, 0, 23, 0, 59],
      label: 1,
    },
    {
      features: [4, 129, 60, 12, 231, 27, 0, 31],
      label: 0,
    },
    {
      features: [3, 112, 74, 30, 0, 31, 0, 25],
      label: 1,
    },
    {
      features: [0, 124, 70, 20, 0, 27, 0, 36],
      label: 1,
    },
    {
      features: [13, 152, 90, 33, 29, 26, 0, 43],
      label: 1,
    },
    {
      features: [2, 112, 75, 32, 0, 35, 0, 21],
      label: 0,
    },
    {
      features: [1, 157, 72, 21, 168, 25, 0, 24],
      label: 0,
    },
    {
      features: [1, 122, 64, 32, 156, 35, 0, 30],
      label: 1,
    },
    {
      features: [10, 179, 70, 0, 0, 35, 0, 37],
      label: 0,
    },
    {
      features: [2, 102, 86, 36, 120, 45, 0, 23],
      label: 1,
    },
    {
      features: [6, 105, 70, 32, 68, 30, 0, 37],
      label: 0,
    },
    {
      features: [8, 118, 72, 19, 0, 23, 1, 46],
      label: 0,
    },
    {
      features: [2, 87, 58, 16, 52, 32, 0, 25],
      label: 0,
    },
    {
      features: [1, 180, 0, 0, 0, 43, 0, 41],
      label: 1,
    },
    {
      features: [12, 106, 80, 0, 0, 23, 0, 44],
      label: 0,
    },
    {
      features: [1, 95, 60, 18, 58, 23, 0, 22],
      label: 0,
    },
    {
      features: [0, 165, 76, 43, 255, 47, 0, 26],
      label: 0,
    },
    {
      features: [0, 117, 0, 0, 0, 33, 0, 44],
      label: 0,
    },
    {
      features: [5, 115, 76, 0, 0, 31, 0, 44],
      label: 1,
    },
    {
      features: [9, 152, 78, 34, 171, 34, 0, 33],
      label: 1,
    },
    {
      features: [7, 178, 84, 0, 0, 39, 0, 41],
      label: 1,
    },
    {
      features: [1, 130, 70, 13, 105, 25, 0, 22],
      label: 0,
    },
    {
      features: [1, 95, 74, 21, 73, 25, 0, 36],
      label: 0,
    },
    {
      features: [1, 0, 68, 35, 0, 32, 0, 22],
      label: 0,
    },
    {
      features: [5, 122, 86, 0, 0, 34, 0, 33],
      label: 0,
    },
    {
      features: [8, 95, 72, 0, 0, 36, 0, 57],
      label: 0,
    },
    {
      features: [8, 126, 88, 36, 108, 38, 0, 49],
      label: 0,
    },
    {
      features: [1, 139, 46, 19, 83, 28, 0, 22],
      label: 0,
    },
    {
      features: [3, 116, 0, 0, 0, 23, 0, 23],
      label: 0,
    },
    {
      features: [3, 99, 62, 19, 74, 21, 0, 26],
      label: 0,
    },
    {
      features: [5, 0, 80, 32, 0, 41, 0, 37],
      label: 1,
    },
    {
      features: [4, 92, 80, 0, 0, 42, 0, 29],
      label: 0,
    },
    {
      features: [4, 137, 84, 0, 0, 31, 0, 30],
      label: 0,
    },
    {
      features: [3, 61, 82, 28, 0, 34, 0, 46],
      label: 0,
    },
    {
      features: [1, 90, 62, 12, 43, 27, 0, 24],
      label: 0,
    },
    {
      features: [3, 90, 78, 0, 0, 42, 0, 21],
      label: 0,
    },
    {
      features: [9, 165, 88, 0, 0, 30, 0, 49],
      label: 1,
    },
    {
      features: [1, 125, 50, 40, 167, 33, 0, 28],
      label: 1,
    },
    {
      features: [13, 129, 0, 30, 0, 39, 0, 44],
      label: 1,
    },
    {
      features: [12, 88, 74, 40, 54, 35, 0, 48],
      label: 0,
    },
    {
      features: [1, 196, 76, 36, 249, 36, 0, 29],
      label: 1,
    },
    {
      features: [5, 189, 64, 33, 325, 31, 0, 29],
      label: 1,
    },
    {
      features: [5, 158, 70, 0, 0, 29, 0, 63],
      label: 0,
    },
    {
      features: [5, 103, 108, 37, 0, 39, 0, 65],
      label: 0,
    },
    {
      features: [4, 146, 78, 0, 0, 38, 0, 67],
      label: 1,
    },
    {
      features: [4, 147, 74, 25, 293, 34, 0, 30],
      label: 0,
    },
    {
      features: [5, 99, 54, 28, 83, 34, 0, 30],
      label: 0,
    },
    {
      features: [6, 124, 72, 0, 0, 27, 0, 29],
      label: 1,
    },
    {
      features: [0, 101, 64, 17, 0, 21, 0, 21],
      label: 0,
    },
    {
      features: [3, 81, 86, 16, 66, 27, 0, 22],
      label: 0,
    },
    {
      features: [1, 133, 102, 28, 140, 32, 0, 45],
      label: 1,
    },
    {
      features: [3, 173, 82, 48, 465, 38, 2, 25],
      label: 1,
    },
    {
      features: [0, 118, 64, 23, 89, 0, 1, 21],
      label: 0,
    },
    {
      features: [0, 84, 64, 22, 66, 35, 0, 21],
      label: 0,
    },
    {
      features: [2, 105, 58, 40, 94, 34, 0, 25],
      label: 0,
    },
    {
      features: [2, 122, 52, 43, 158, 36, 0, 28],
      label: 0,
    },
    {
      features: [12, 140, 82, 43, 325, 39, 0, 58],
      label: 1,
    },
    {
      features: [0, 98, 82, 15, 84, 25, 0, 22],
      label: 0,
    },
    {
      features: [1, 87, 60, 37, 75, 37, 0, 22],
      label: 0,
    },
    {
      features: [4, 156, 75, 0, 0, 48, 0, 32],
      label: 1,
    },
    {
      features: [0, 93, 100, 39, 72, 43, 1, 35],
      label: 0,
    },
    {
      features: [1, 107, 72, 30, 82, 30, 0, 24],
      label: 0,
    },
    {
      features: [0, 105, 68, 22, 0, 20, 0, 22],
      label: 0,
    },
    {
      features: [1, 109, 60, 8, 182, 25, 0, 21],
      label: 0,
    },
    {
      features: [1, 90, 62, 18, 59, 25, 1, 25],
      label: 0,
    },
    {
      features: [1, 125, 70, 24, 110, 24, 0, 25],
      label: 0,
    },
    {
      features: [1, 119, 54, 13, 50, 22, 0, 24],
      label: 0,
    },
    {
      features: [5, 116, 74, 29, 0, 32, 0, 35],
      label: 1,
    },
    {
      features: [8, 105, 100, 36, 0, 43, 0, 45],
      label: 1,
    },
    {
      features: [5, 144, 82, 26, 285, 32, 0, 58],
      label: 1,
    },
    {
      features: [3, 100, 68, 23, 81, 31, 0, 28],
      label: 0,
    },
    {
      features: [1, 100, 66, 29, 196, 32, 0, 42],
      label: 0,
    },
    {
      features: [5, 166, 76, 0, 0, 45, 0, 27],
      label: 1,
    },
    {
      features: [1, 131, 64, 14, 415, 23, 0, 21],
      label: 0,
    },
    {
      features: [4, 116, 72, 12, 87, 22, 0, 37],
      label: 0,
    },
    {
      features: [4, 158, 78, 0, 0, 32, 0, 31],
      label: 1,
    },
    {
      features: [2, 127, 58, 24, 275, 27, 1, 25],
      label: 0,
    },
    {
      features: [3, 96, 56, 34, 115, 24, 0, 39],
      label: 0,
    },
    {
      features: [0, 131, 66, 40, 0, 34, 0, 22],
      label: 1,
    },
    {
      features: [3, 82, 70, 0, 0, 21, 0, 25],
      label: 0,
    },
    {
      features: [3, 193, 70, 31, 0, 34, 0, 25],
      label: 1,
    },
    {
      features: [4, 95, 64, 0, 0, 32, 0, 31],
      label: 1,
    },
    {
      features: [6, 137, 61, 0, 0, 24, 0, 55],
      label: 0,
    },
    {
      features: [5, 136, 84, 41, 88, 35, 0, 35],
      label: 1,
    },
    {
      features: [9, 72, 78, 25, 0, 31, 0, 38],
      label: 0,
    },
    {
      features: [5, 168, 64, 0, 0, 32, 0, 41],
      label: 1,
    },
    {
      features: [2, 123, 48, 32, 165, 42, 0, 26],
      label: 0,
    },
    {
      features: [4, 115, 72, 0, 0, 28, 0, 46],
      label: 1,
    },
    {
      features: [0, 101, 62, 0, 0, 21, 0, 25],
      label: 0,
    },
    {
      features: [8, 197, 74, 0, 0, 25, 1, 39],
      label: 1,
    },
    {
      features: [1, 172, 68, 49, 579, 42, 0, 28],
      label: 1,
    },
    {
      features: [6, 102, 90, 39, 0, 35, 0, 28],
      label: 0,
    },
    {
      features: [1, 112, 72, 30, 176, 34, 0, 25],
      label: 0,
    },
    {
      features: [1, 143, 84, 23, 310, 42, 1, 22],
      label: 0,
    },
    {
      features: [1, 143, 74, 22, 61, 26, 0, 21],
      label: 0,
    },
    {
      features: [0, 138, 60, 35, 167, 34, 0, 21],
      label: 1,
    },
    {
      features: [3, 173, 84, 33, 474, 35, 0, 22],
      label: 1,
    },
    {
      features: [1, 97, 68, 21, 0, 27, 1, 22],
      label: 0,
    },
    {
      features: [4, 144, 82, 32, 0, 38, 0, 37],
      label: 1,
    },
    {
      features: [1, 83, 68, 0, 0, 18, 0, 27],
      label: 0,
    },
    {
      features: [3, 129, 64, 29, 115, 26, 0, 28],
      label: 1,
    },
    {
      features: [1, 119, 88, 41, 170, 45, 0, 26],
      label: 0,
    },
    {
      features: [2, 94, 68, 18, 76, 26, 0, 21],
      label: 0,
    },
    {
      features: [0, 102, 64, 46, 78, 40, 0, 21],
      label: 0,
    },
    {
      features: [2, 115, 64, 22, 0, 30, 0, 21],
      label: 0,
    },
    {
      features: [8, 151, 78, 32, 210, 42, 0, 36],
      label: 1,
    },
    {
      features: [4, 184, 78, 39, 277, 37, 0, 31],
      label: 1,
    },
    {
      features: [0, 94, 0, 0, 0, 0, 0, 25],
      label: 0,
    },
    {
      features: [1, 181, 64, 30, 180, 34, 0, 38],
      label: 1,
    },
    {
      features: [0, 135, 94, 46, 145, 40, 0, 26],
      label: 0,
    },
    {
      features: [1, 95, 82, 25, 180, 35, 0, 43],
      label: 1,
    },
    {
      features: [2, 99, 0, 0, 0, 22, 0, 23],
      label: 0,
    },
    {
      features: [3, 89, 74, 16, 85, 30, 0, 38],
      label: 0,
    },
    {
      features: [1, 80, 74, 11, 60, 30, 0, 22],
      label: 0,
    },
    {
      features: [2, 139, 75, 0, 0, 25, 0, 29],
      label: 0,
    },
    {
      features: [1, 90, 68, 8, 0, 24, 1, 36],
      label: 0,
    },
    {
      features: [0, 141, 0, 0, 0, 42, 0, 29],
      label: 1,
    },
    {
      features: [12, 140, 85, 33, 0, 37, 0, 41],
      label: 0,
    },
    {
      features: [5, 147, 75, 0, 0, 29, 0, 28],
      label: 0,
    },
    {
      features: [1, 97, 70, 15, 0, 18, 0, 21],
      label: 0,
    },
    {
      features: [6, 107, 88, 0, 0, 36, 0, 31],
      label: 0,
    },
    {
      features: [0, 189, 104, 25, 0, 34, 0, 41],
      label: 1,
    },
    {
      features: [2, 83, 66, 23, 50, 32, 0, 22],
      label: 0,
    },
    {
      features: [4, 117, 64, 27, 120, 33, 0, 24],
      label: 0,
    },
    {
      features: [8, 108, 70, 0, 0, 30, 0, 33],
      label: 1,
    },
    {
      features: [4, 117, 62, 12, 0, 29, 0, 30],
      label: 1,
    },
    {
      features: [0, 180, 78, 63, 14, 59, 2, 25],
      label: 1,
    },
    {
      features: [1, 100, 72, 12, 70, 25, 0, 28],
      label: 0,
    },
    {
      features: [0, 95, 80, 45, 92, 36, 0, 26],
      label: 0,
    },
    {
      features: [0, 104, 64, 37, 64, 33, 0, 22],
      label: 1,
    },
    {
      features: [0, 120, 74, 18, 63, 30, 0, 26],
      label: 0,
    },
    {
      features: [1, 82, 64, 13, 95, 21, 0, 23],
      label: 0,
    },
    {
      features: [2, 134, 70, 0, 0, 28, 0, 23],
      label: 1,
    },
    {
      features: [0, 91, 68, 32, 210, 39, 0, 25],
      label: 0,
    },
    {
      features: [2, 119, 0, 0, 0, 19, 0, 72],
      label: 0,
    },
    {
      features: [2, 100, 54, 28, 105, 37, 0, 24],
      label: 0,
    },
    {
      features: [14, 175, 62, 30, 0, 33, 0, 38],
      label: 1,
    },
    {
      features: [1, 135, 54, 0, 0, 26, 0, 62],
      label: 0,
    },
    {
      features: [5, 86, 68, 28, 71, 30, 0, 24],
      label: 0,
    },
    {
      features: [10, 148, 84, 48, 237, 37, 1, 51],
      label: 1,
    },
    {
      features: [9, 134, 74, 33, 60, 25, 0, 81],
      label: 0,
    },
    {
      features: [9, 120, 72, 22, 56, 20, 0, 48],
      label: 0,
    },
    {
      features: [1, 71, 62, 0, 0, 21, 0, 26],
      label: 0,
    },
    {
      features: [8, 74, 70, 40, 49, 35, 0, 39],
      label: 0,
    },
    {
      features: [5, 88, 78, 30, 0, 27, 0, 37],
      label: 0,
    },
    {
      features: [10, 115, 98, 0, 0, 24, 1, 34],
      label: 0,
    },
    {
      features: [0, 124, 56, 13, 105, 21, 0, 21],
      label: 0,
    },
    {
      features: [0, 74, 52, 10, 36, 27, 0, 22],
      label: 0,
    },
    {
      features: [0, 97, 64, 36, 100, 36, 0, 25],
      label: 0,
    },
    {
      features: [8, 120, 0, 0, 0, 30, 0, 38],
      label: 1,
    },
    {
      features: [6, 154, 78, 41, 140, 46, 0, 27],
      label: 0,
    },
    {
      features: [1, 144, 82, 40, 0, 41, 0, 28],
      label: 0,
    },
    {
      features: [0, 137, 70, 38, 0, 33, 0, 22],
      label: 0,
    },
    {
      features: [0, 119, 66, 27, 0, 38, 0, 22],
      label: 0,
    },
    {
      features: [7, 136, 90, 0, 0, 29, 0, 50],
      label: 0,
    },
    {
      features: [4, 114, 64, 0, 0, 28, 0, 24],
      label: 0,
    },
    {
      features: [0, 137, 84, 27, 0, 27, 0, 59],
      label: 0,
    },
    {
      features: [2, 105, 80, 45, 191, 33, 0, 29],
      label: 1,
    },
    {
      features: [7, 114, 76, 17, 110, 23, 0, 31],
      label: 0,
    },
    {
      features: [8, 126, 74, 38, 75, 25, 0, 39],
      label: 0,
    },
    {
      features: [4, 132, 86, 31, 0, 28, 0, 63],
      label: 0,
    },
    {
      features: [3, 158, 70, 30, 328, 35, 0, 35],
      label: 1,
    },
    {
      features: [0, 123, 88, 37, 0, 35, 0, 29],
      label: 0,
    },
    {
      features: [4, 85, 58, 22, 49, 27, 0, 28],
      label: 0,
    },
    {
      features: [0, 84, 82, 31, 125, 38, 0, 23],
      label: 0,
    },
    {
      features: [0, 145, 0, 0, 0, 44, 0, 31],
      label: 1,
    },
    {
      features: [0, 135, 68, 42, 250, 42, 0, 24],
      label: 1,
    },
    {
      features: [1, 139, 62, 41, 480, 40, 0, 21],
      label: 0,
    },
    {
      features: [0, 173, 78, 32, 265, 46, 1, 58],
      label: 0,
    },
    {
      features: [4, 99, 72, 17, 0, 25, 0, 28],
      label: 0,
    },
    {
      features: [8, 194, 80, 0, 0, 26, 0, 67],
      label: 0,
    },
    {
      features: [2, 83, 65, 28, 66, 36, 0, 24],
      label: 0,
    },
    {
      features: [2, 89, 90, 30, 0, 33, 0, 42],
      label: 0,
    },
    {
      features: [4, 99, 68, 38, 0, 32, 0, 33],
      label: 0,
    },
    {
      features: [4, 125, 70, 18, 122, 28, 1, 45],
      label: 1,
    },
    {
      features: [3, 80, 0, 0, 0, 0, 0, 22],
      label: 0,
    },
    {
      features: [6, 166, 74, 0, 0, 26, 0, 66],
      label: 0,
    },
    {
      features: [5, 110, 68, 0, 0, 26, 0, 30],
      label: 0,
    },
    {
      features: [2, 81, 72, 15, 76, 30, 0, 25],
      label: 0,
    },
    {
      features: [7, 195, 70, 33, 145, 25, 0, 55],
      label: 1,
    },
    {
      features: [6, 154, 74, 32, 193, 29, 0, 39],
      label: 0,
    },
    {
      features: [2, 117, 90, 19, 71, 25, 0, 21],
      label: 0,
    },
    {
      features: [3, 84, 72, 32, 0, 37, 0, 28],
      label: 0,
    },
    {
      features: [6, 0, 68, 41, 0, 39, 0, 41],
      label: 1,
    },
    {
      features: [7, 94, 64, 25, 79, 33, 0, 41],
      label: 0,
    },
    {
      features: [3, 96, 78, 39, 0, 37, 0, 40],
      label: 0,
    },
    {
      features: [10, 75, 82, 0, 0, 33, 0, 38],
      label: 0,
    },
    {
      features: [0, 180, 90, 26, 90, 36, 0, 35],
      label: 1,
    },
    {
      features: [1, 130, 60, 23, 170, 28, 0, 21],
      label: 0,
    },
    {
      features: [2, 84, 50, 23, 76, 30, 0, 21],
      label: 0,
    },
    {
      features: [8, 120, 78, 0, 0, 25, 0, 64],
      label: 0,
    },
    {
      features: [12, 84, 72, 31, 0, 29, 0, 46],
      label: 1,
    },
    {
      features: [0, 139, 62, 17, 210, 22, 0, 21],
      label: 0,
    },
    {
      features: [9, 91, 68, 0, 0, 24, 0, 58],
      label: 0,
    },
    {
      features: [2, 91, 62, 0, 0, 27, 0, 22],
      label: 0,
    },
    {
      features: [3, 99, 54, 19, 86, 25, 0, 24],
      label: 0,
    },
    {
      features: [3, 163, 70, 18, 105, 31, 0, 28],
      label: 1,
    },
    {
      features: [9, 145, 88, 34, 165, 30, 0, 53],
      label: 1,
    },
    {
      features: [7, 125, 86, 0, 0, 37, 0, 51],
      label: 0,
    },
    {
      features: [13, 76, 60, 0, 0, 32, 0, 41],
      label: 0,
    },
    {
      features: [6, 129, 90, 7, 326, 19, 0, 60],
      label: 0,
    },
    {
      features: [2, 68, 70, 32, 66, 25, 0, 25],
      label: 0,
    },
    {
      features: [3, 124, 80, 33, 130, 33, 0, 26],
      label: 0,
    },
    {
      features: [6, 114, 0, 0, 0, 0, 0, 26],
      label: 0,
    },
    {
      features: [9, 130, 70, 0, 0, 34, 0, 45],
      label: 1,
    },
    {
      features: [3, 125, 58, 0, 0, 31, 0, 24],
      label: 0,
    },
    {
      features: [3, 87, 60, 18, 0, 21, 0, 21],
      label: 0,
    },
    {
      features: [1, 97, 64, 19, 82, 18, 0, 21],
      label: 0,
    },
    {
      features: [3, 116, 74, 15, 105, 26, 0, 24],
      label: 0,
    },
    {
      features: [0, 117, 66, 31, 188, 30, 0, 22],
      label: 0,
    },
    {
      features: [0, 111, 65, 0, 0, 24, 0, 31],
      label: 0,
    },
    {
      features: [2, 122, 60, 18, 106, 29, 0, 22],
      label: 0,
    },
    {
      features: [0, 107, 76, 0, 0, 45, 0, 24],
      label: 0,
    },
    {
      features: [1, 86, 66, 52, 65, 41, 0, 29],
      label: 0,
    },
    {
      features: [6, 91, 0, 0, 0, 29, 0, 31],
      label: 0,
    },
    {
      features: [1, 77, 56, 30, 56, 33, 1, 24],
      label: 0,
    },
    {
      features: [4, 132, 0, 0, 0, 32, 0, 23],
      label: 1,
    },
    {
      features: [0, 105, 90, 0, 0, 29, 0, 46],
      label: 0,
    },
    {
      features: [0, 57, 60, 0, 0, 21, 0, 67],
      label: 0,
    },
    {
      features: [0, 127, 80, 37, 210, 36, 0, 23],
      label: 0,
    },
    {
      features: [3, 129, 92, 49, 155, 36, 0, 32],
      label: 1,
    },
    {
      features: [8, 100, 74, 40, 215, 39, 0, 43],
      label: 1,
    },
    {
      features: [3, 128, 72, 25, 190, 32, 0, 27],
      label: 1,
    },
    {
      features: [10, 90, 85, 32, 0, 34, 0, 56],
      label: 1,
    },
    {
      features: [4, 84, 90, 23, 56, 39, 0, 25],
      label: 0,
    },
    {
      features: [1, 88, 78, 29, 76, 32, 0, 29],
      label: 0,
    },
    {
      features: [8, 186, 90, 35, 225, 34, 0, 37],
      label: 1,
    },
    {
      features: [5, 187, 76, 27, 207, 43, 1, 53],
      label: 1,
    },
    {
      features: [4, 131, 68, 21, 166, 33, 0, 28],
      label: 0,
    },
    {
      features: [1, 164, 82, 43, 67, 32, 0, 50],
      label: 0,
    },
    {
      features: [4, 189, 110, 31, 0, 28, 0, 37],
      label: 0,
    },
    {
      features: [1, 116, 70, 28, 0, 27, 0, 21],
      label: 0,
    },
    {
      features: [3, 84, 68, 30, 106, 31, 0, 25],
      label: 0,
    },
    {
      features: [6, 114, 88, 0, 0, 27, 0, 66],
      label: 0,
    },
    {
      features: [1, 88, 62, 24, 44, 29, 0, 23],
      label: 0,
    },
    {
      features: [1, 84, 64, 23, 115, 36, 0, 28],
      label: 0,
    },
    {
      features: [7, 124, 70, 33, 215, 25, 0, 37],
      label: 0,
    },
    {
      features: [1, 97, 70, 40, 0, 38, 0, 30],
      label: 0,
    },
    {
      features: [8, 110, 76, 0, 0, 27, 0, 58],
      label: 0,
    },
    {
      features: [11, 103, 68, 40, 0, 46, 0, 42],
      label: 0,
    },
    {
      features: [11, 85, 74, 0, 0, 30, 0, 35],
      label: 0,
    },
    {
      features: [6, 125, 76, 0, 0, 33, 0, 54],
      label: 1,
    },
    {
      features: [0, 198, 66, 32, 274, 41, 0, 28],
      label: 1,
    },
    {
      features: [1, 87, 68, 34, 77, 37, 0, 24],
      label: 0,
    },
    {
      features: [6, 99, 60, 19, 54, 26, 0, 32],
      label: 0,
    },
    {
      features: [0, 91, 80, 0, 0, 32, 0, 27],
      label: 0,
    },
    {
      features: [2, 95, 54, 14, 88, 26, 0, 22],
      label: 0,
    },
    {
      features: [1, 99, 72, 30, 18, 38, 0, 21],
      label: 0,
    },
    {
      features: [6, 92, 62, 32, 126, 32, 0, 46],
      label: 0,
    },
    {
      features: [4, 154, 72, 29, 126, 31, 0, 37],
      label: 0,
    },
    {
      features: [0, 121, 66, 30, 165, 34, 0, 33],
      label: 1,
    },
    {
      features: [3, 78, 70, 0, 0, 32, 0, 39],
      label: 0,
    },
    {
      features: [2, 130, 96, 0, 0, 22, 0, 21],
      label: 0,
    },
    {
      features: [3, 111, 58, 31, 44, 29, 0, 22],
      label: 0,
    },
    {
      features: [2, 98, 60, 17, 120, 34, 0, 22],
      label: 0,
    },
    {
      features: [1, 143, 86, 30, 330, 30, 0, 23],
      label: 0,
    },
    {
      features: [1, 119, 44, 47, 63, 35, 0, 25],
      label: 0,
    },
    {
      features: [6, 108, 44, 20, 130, 24, 0, 35],
      label: 0,
    },
    {
      features: [2, 118, 80, 0, 0, 42, 0, 21],
      label: 1,
    },
    {
      features: [10, 133, 68, 0, 0, 27, 0, 36],
      label: 0,
    },
    {
      features: [2, 197, 70, 99, 0, 34, 0, 62],
      label: 1,
    },
    {
      features: [0, 151, 90, 46, 0, 42, 0, 21],
      label: 1,
    },
    {
      features: [6, 109, 60, 27, 0, 25, 0, 27],
      label: 0,
    },
    {
      features: [12, 121, 78, 17, 0, 26, 0, 62],
      label: 0,
    },
    {
      features: [8, 100, 76, 0, 0, 38, 0, 42],
      label: 0,
    },
    {
      features: [8, 124, 76, 24, 600, 28, 0, 52],
      label: 1,
    },
    {
      features: [1, 93, 56, 11, 0, 22, 0, 22],
      label: 0,
    },
    {
      features: [8, 143, 66, 0, 0, 34, 0, 41],
      label: 1,
    },
    {
      features: [6, 103, 66, 0, 0, 24, 0, 29],
      label: 0,
    },
    {
      features: [3, 176, 86, 27, 156, 33, 1, 52],
      label: 1,
    },
    {
      features: [0, 73, 0, 0, 0, 21, 0, 25],
      label: 0,
    },
    {
      features: [11, 111, 84, 40, 0, 46, 0, 45],
      label: 1,
    },
    {
      features: [2, 112, 78, 50, 140, 39, 0, 24],
      label: 0,
    },
    {
      features: [3, 132, 80, 0, 0, 34, 0, 44],
      label: 1,
    },
    {
      features: [2, 82, 52, 22, 115, 28, 1, 25],
      label: 0,
    },
    {
      features: [6, 123, 72, 45, 230, 33, 0, 34],
      label: 0,
    },
    {
      features: [0, 188, 82, 14, 185, 32, 0, 22],
      label: 1,
    },
    {
      features: [0, 67, 76, 0, 0, 45, 0, 46],
      label: 0,
    },
    {
      features: [1, 89, 24, 19, 25, 27, 0, 21],
      label: 0,
    },
    {
      features: [1, 173, 74, 0, 0, 36, 0, 38],
      label: 1,
    },
    {
      features: [1, 109, 38, 18, 120, 23, 0, 26],
      label: 0,
    },
    {
      features: [1, 108, 88, 19, 0, 27, 0, 24],
      label: 0,
    },
    {
      features: [6, 96, 0, 0, 0, 23, 0, 28],
      label: 0,
    },
    {
      features: [1, 124, 74, 36, 0, 27, 0, 30],
      label: 0,
    },
    {
      features: [7, 150, 78, 29, 126, 35, 0, 54],
      label: 1,
    },
    {
      features: [4, 183, 0, 0, 0, 28, 0, 36],
      label: 1,
    },
    {
      features: [1, 124, 60, 32, 0, 35, 0, 21],
      label: 0,
    },
    {
      features: [1, 181, 78, 42, 293, 40, 1, 22],
      label: 1,
    },
    {
      features: [1, 92, 62, 25, 41, 19, 0, 25],
      label: 0,
    },
    {
      features: [0, 152, 82, 39, 272, 41, 0, 27],
      label: 0,
    },
    {
      features: [1, 111, 62, 13, 182, 24, 0, 23],
      label: 0,
    },
    {
      features: [3, 106, 54, 21, 158, 30, 0, 24],
      label: 0,
    },
    {
      features: [3, 174, 58, 22, 194, 32, 0, 36],
      label: 1,
    },
    {
      features: [7, 168, 88, 42, 321, 38, 0, 40],
      label: 1,
    },
    {
      features: [6, 105, 80, 28, 0, 32, 0, 26],
      label: 0,
    },
    {
      features: [11, 138, 74, 26, 144, 36, 0, 50],
      label: 1,
    },
    {
      features: [3, 106, 72, 0, 0, 25, 0, 27],
      label: 0,
    },
    {
      features: [6, 117, 96, 0, 0, 28, 0, 30],
      label: 0,
    },
    {
      features: [2, 68, 62, 13, 15, 20, 0, 23],
      label: 0,
    },
    {
      features: [9, 112, 82, 24, 0, 28, 1, 50],
      label: 1,
    },
    {
      features: [0, 119, 0, 0, 0, 32, 0, 24],
      label: 1,
    },
    {
      features: [2, 112, 86, 42, 160, 38, 0, 28],
      label: 0,
    },
    {
      features: [2, 92, 76, 20, 0, 24, 1, 28],
      label: 0,
    },
    {
      features: [6, 183, 94, 0, 0, 40, 1, 45],
      label: 0,
    },
    {
      features: [0, 94, 70, 27, 115, 43, 0, 21],
      label: 0,
    },
    {
      features: [2, 108, 64, 0, 0, 30, 0, 21],
      label: 0,
    },
    {
      features: [4, 90, 88, 47, 54, 37, 0, 29],
      label: 0,
    },
    {
      features: [0, 125, 68, 0, 0, 24, 0, 21],
      label: 0,
    },
    {
      features: [0, 132, 78, 0, 0, 32, 0, 21],
      label: 0,
    },
    {
      features: [5, 128, 80, 0, 0, 34, 0, 45],
      label: 0,
    },
    {
      features: [4, 94, 65, 22, 0, 24, 0, 21],
      label: 0,
    },
    {
      features: [7, 114, 64, 0, 0, 27, 0, 34],
      label: 1,
    },
    {
      features: [0, 102, 78, 40, 90, 34, 0, 24],
      label: 0,
    },
    {
      features: [2, 111, 60, 0, 0, 26, 0, 23],
      label: 0,
    },
    {
      features: [1, 128, 82, 17, 183, 27, 0, 22],
      label: 0,
    },
    {
      features: [10, 92, 62, 0, 0, 25, 0, 31],
      label: 0,
    },
    {
      features: [13, 104, 72, 0, 0, 31, 0, 38],
      label: 1,
    },
    {
      features: [5, 104, 74, 0, 0, 28, 0, 48],
      label: 0,
    },
    {
      features: [2, 94, 76, 18, 66, 31, 0, 23],
      label: 0,
    },
    {
      features: [7, 97, 76, 32, 91, 40, 0, 32],
      label: 1,
    },
    {
      features: [1, 100, 74, 12, 46, 19, 0, 28],
      label: 0,
    },
    {
      features: [0, 102, 86, 17, 105, 29, 0, 27],
      label: 0,
    },
    {
      features: [4, 128, 70, 0, 0, 34, 0, 24],
      label: 0,
    },
    {
      features: [6, 147, 80, 0, 0, 29, 0, 50],
      label: 1,
    },
    {
      features: [4, 90, 0, 0, 0, 28, 0, 31],
      label: 0,
    },
    {
      features: [3, 103, 72, 30, 152, 27, 0, 27],
      label: 0,
    },
    {
      features: [2, 157, 74, 35, 440, 39, 0, 30],
      label: 0,
    },
    {
      features: [1, 167, 74, 17, 144, 23, 0, 33],
      label: 1,
    },
    {
      features: [0, 179, 50, 36, 159, 37, 0, 22],
      label: 1,
    },
    {
      features: [11, 136, 84, 35, 130, 28, 0, 42],
      label: 1,
    },
    {
      features: [0, 107, 60, 25, 0, 26, 0, 23],
      label: 0,
    },
    {
      features: [1, 91, 54, 25, 100, 25, 0, 23],
      label: 0,
    },
    {
      features: [1, 117, 60, 23, 106, 33, 0, 27],
      label: 0,
    },
    {
      features: [5, 123, 74, 40, 77, 34, 0, 28],
      label: 0,
    },
    {
      features: [2, 120, 54, 0, 0, 26, 0, 27],
      label: 0,
    },
    {
      features: [1, 106, 70, 28, 135, 34, 0, 22],
      label: 0,
    },
    {
      features: [2, 155, 52, 27, 540, 38, 0, 25],
      label: 1,
    },
    {
      features: [2, 101, 58, 35, 90, 21, 0, 22],
      label: 0,
    },
    {
      features: [1, 120, 80, 48, 200, 38, 1, 41],
      label: 0,
    },
    {
      features: [11, 127, 106, 0, 0, 39, 0, 51],
      label: 0,
    },
    {
      features: [3, 80, 82, 31, 70, 34, 1, 27],
      label: 1,
    },
    {
      features: [10, 162, 84, 0, 0, 27, 0, 54],
      label: 0,
    },
    {
      features: [1, 199, 76, 43, 0, 42, 1, 22],
      label: 1,
    },
    {
      features: [8, 167, 106, 46, 231, 37, 0, 43],
      label: 1,
    },
    {
      features: [9, 145, 80, 46, 130, 37, 0, 40],
      label: 1,
    },
    {
      features: [6, 115, 60, 39, 0, 33, 0, 40],
      label: 1,
    },
    {
      features: [1, 112, 80, 45, 132, 34, 0, 24],
      label: 0,
    },
    {
      features: [4, 145, 82, 18, 0, 32, 0, 70],
      label: 1,
    },
    {
      features: [10, 111, 70, 27, 0, 27, 0, 40],
      label: 1,
    },
    {
      features: [6, 98, 58, 33, 190, 34, 0, 43],
      label: 0,
    },
    {
      features: [9, 154, 78, 30, 100, 30, 0, 45],
      label: 0,
    },
    {
      features: [6, 165, 68, 26, 168, 33, 0, 49],
      label: 0,
    },
    {
      features: [1, 99, 58, 10, 0, 25, 0, 21],
      label: 0,
    },
    {
      features: [10, 68, 106, 23, 49, 35, 0, 47],
      label: 0,
    },
    {
      features: [3, 123, 100, 35, 240, 57, 0, 22],
      label: 0,
    },
    {
      features: [8, 91, 82, 0, 0, 35, 0, 68],
      label: 0,
    },
    {
      features: [6, 195, 70, 0, 0, 30, 0, 31],
      label: 1,
    },
    {
      features: [9, 156, 86, 0, 0, 24, 0, 53],
      label: 1,
    },
    {
      features: [0, 93, 60, 0, 0, 35, 0, 25],
      label: 0,
    },
    {
      features: [3, 121, 52, 0, 0, 36, 0, 25],
      label: 1,
    },
    {
      features: [2, 101, 58, 17, 265, 24, 0, 23],
      label: 0,
    },
    {
      features: [2, 56, 56, 28, 45, 24, 0, 22],
      label: 0,
    },
    {
      features: [0, 162, 76, 36, 0, 49, 0, 26],
      label: 1,
    },
    {
      features: [0, 95, 64, 39, 105, 44, 0, 22],
      label: 0,
    },
    {
      features: [4, 125, 80, 0, 0, 32, 0, 27],
      label: 1,
    },
    {
      features: [5, 136, 82, 0, 0, 0, 0, 69],
      label: 0,
    },
    {
      features: [2, 129, 74, 26, 205, 33, 0, 25],
      label: 0,
    },
    {
      features: [3, 130, 64, 0, 0, 23, 0, 22],
      label: 0,
    },
    {
      features: [1, 107, 50, 19, 0, 28, 0, 29],
      label: 0,
    },
    {
      features: [1, 140, 74, 26, 180, 24, 0, 23],
      label: 0,
    },
    {
      features: [1, 144, 82, 46, 180, 46, 0, 46],
      label: 1,
    },
    {
      features: [8, 107, 80, 0, 0, 24, 0, 34],
      label: 0,
    },
    {
      features: [13, 158, 114, 0, 0, 42, 0, 44],
      label: 1,
    },
    {
      features: [2, 121, 70, 32, 95, 39, 0, 23],
      label: 0,
    },
    {
      features: [7, 129, 68, 49, 125, 38, 0, 43],
      label: 1,
    },
    {
      features: [2, 90, 60, 0, 0, 23, 0, 25],
      label: 0,
    },
    {
      features: [7, 142, 90, 24, 480, 30, 0, 43],
      label: 1,
    },
    {
      features: [3, 169, 74, 19, 125, 29, 0, 31],
      label: 1,
    },
    {
      features: [0, 99, 0, 0, 0, 25, 0, 22],
      label: 0,
    },
    {
      features: [4, 127, 88, 11, 155, 34, 0, 28],
      label: 0,
    },
    {
      features: [4, 118, 70, 0, 0, 44, 0, 26],
      label: 0,
    },
    {
      features: [2, 122, 76, 27, 200, 35, 0, 26],
      label: 0,
    },
    {
      features: [6, 125, 78, 31, 0, 27, 0, 49],
      label: 1,
    },
    {
      features: [1, 168, 88, 29, 0, 35, 0, 52],
      label: 1,
    },
    {
      features: [2, 129, 0, 0, 0, 38, 0, 41],
      label: 0,
    },
    {
      features: [4, 110, 76, 20, 100, 28, 0, 27],
      label: 0,
    },
    {
      features: [6, 80, 80, 36, 0, 39, 0, 28],
      label: 0,
    },
    {
      features: [10, 115, 0, 0, 0, 0, 0, 30],
      label: 1,
    },
    {
      features: [2, 127, 46, 21, 335, 34, 0, 22],
      label: 0,
    },
    {
      features: [9, 164, 78, 0, 0, 32, 0, 45],
      label: 1,
    },
    {
      features: [2, 93, 64, 32, 160, 38, 0, 23],
      label: 1,
    },
    {
      features: [3, 158, 64, 13, 387, 31, 0, 24],
      label: 0,
    },
    {
      features: [5, 126, 78, 27, 22, 29, 0, 40],
      label: 0,
    },
    {
      features: [10, 129, 62, 36, 0, 41, 0, 38],
      label: 1,
    },
    {
      features: [0, 134, 58, 20, 291, 26, 0, 21],
      label: 0,
    },
    {
      features: [3, 102, 74, 0, 0, 29, 0, 32],
      label: 0,
    },
    {
      features: [7, 187, 50, 33, 392, 33, 0, 34],
      label: 1,
    },
    {
      features: [3, 173, 78, 39, 185, 33, 0, 31],
      label: 1,
    },
    {
      features: [10, 94, 72, 18, 0, 23, 0, 56],
      label: 0,
    },
    {
      features: [1, 108, 60, 46, 178, 35, 0, 24],
      label: 0,
    },
    {
      features: [5, 97, 76, 27, 0, 35, 0, 52],
      label: 1,
    },
    {
      features: [4, 83, 86, 19, 0, 29, 0, 34],
      label: 0,
    },
    {
      features: [1, 114, 66, 36, 200, 38, 0, 21],
      label: 0,
    },
    {
      features: [1, 149, 68, 29, 127, 29, 0, 42],
      label: 1,
    },
    {
      features: [5, 117, 86, 30, 105, 39, 0, 42],
      label: 0,
    },
    {
      features: [1, 111, 94, 0, 0, 32, 0, 45],
      label: 0,
    },
    {
      features: [4, 112, 78, 40, 0, 39, 0, 38],
      label: 0,
    },
    {
      features: [1, 116, 78, 29, 180, 36, 0, 25],
      label: 0,
    },
    {
      features: [0, 141, 84, 26, 0, 32, 0, 22],
      label: 0,
    },
    {
      features: [2, 175, 88, 0, 0, 22, 0, 22],
      label: 0,
    },
    {
      features: [2, 92, 52, 0, 0, 30, 0, 22],
      label: 0,
    },
    {
      features: [3, 130, 78, 23, 79, 28, 0, 34],
      label: 1,
    },
    {
      features: [8, 120, 86, 0, 0, 28, 0, 22],
      label: 1,
    },
    {
      features: [2, 174, 88, 37, 120, 44, 0, 24],
      label: 1,
    },
    {
      features: [2, 106, 56, 27, 165, 29, 0, 22],
      label: 0,
    },
    {
      features: [2, 105, 75, 0, 0, 23, 0, 53],
      label: 0,
    },
    {
      features: [4, 95, 60, 32, 0, 35, 0, 28],
      label: 0,
    },
    {
      features: [0, 126, 86, 27, 120, 27, 0, 21],
      label: 0,
    },
    {
      features: [8, 65, 72, 23, 0, 32, 0, 42],
      label: 0,
    },
    {
      features: [2, 99, 60, 17, 160, 36, 0, 21],
      label: 0,
    },
    {
      features: [1, 102, 74, 0, 0, 39, 0, 42],
      label: 1,
    },
    {
      features: [11, 120, 80, 37, 150, 42, 0, 48],
      label: 1,
    },
    {
      features: [3, 102, 44, 20, 94, 30, 0, 26],
      label: 0,
    },
    {
      features: [1, 109, 58, 18, 116, 28, 0, 22],
      label: 0,
    },
    {
      features: [9, 140, 94, 0, 0, 32, 0, 45],
      label: 1,
    },
    {
      features: [13, 153, 88, 37, 140, 40, 1, 39],
      label: 0,
    },
    {
      features: [12, 100, 84, 33, 105, 30, 0, 46],
      label: 0,
    },
    {
      features: [1, 147, 94, 41, 0, 49, 0, 27],
      label: 1,
    },
    {
      features: [1, 81, 74, 41, 57, 46, 1, 32],
      label: 0,
    },
    {
      features: [3, 187, 70, 22, 200, 36, 0, 36],
      label: 1,
    },
    {
      features: [6, 162, 62, 0, 0, 24, 0, 50],
      label: 1,
    },
    {
      features: [4, 136, 70, 0, 0, 31, 1, 22],
      label: 1,
    },
    {
      features: [1, 121, 78, 39, 74, 39, 0, 28],
      label: 0,
    },
    {
      features: [3, 108, 62, 24, 0, 26, 0, 25],
      label: 0,
    },
    {
      features: [0, 181, 88, 44, 510, 43, 0, 26],
      label: 1,
    },
    {
      features: [8, 154, 78, 32, 0, 32, 0, 45],
      label: 1,
    },
    {
      features: [1, 128, 88, 39, 110, 36, 1, 37],
      label: 1,
    },
    {
      features: [7, 137, 90, 41, 0, 32, 0, 39],
      label: 0,
    },
    {
      features: [0, 123, 72, 0, 0, 36, 0, 52],
      label: 1,
    },
    {
      features: [1, 106, 76, 0, 0, 37, 0, 26],
      label: 0,
    },
    {
      features: [6, 190, 92, 0, 0, 35, 0, 66],
      label: 1,
    },
    {
      features: [2, 88, 58, 26, 16, 28, 0, 22],
      label: 0,
    },
    {
      features: [9, 170, 74, 31, 0, 44, 0, 43],
      label: 1,
    },
    {
      features: [9, 89, 62, 0, 0, 22, 0, 33],
      label: 0,
    },
    {
      features: [10, 101, 76, 48, 180, 32, 0, 63],
      label: 0,
    },
    {
      features: [2, 122, 70, 27, 0, 36, 0, 27],
      label: 0,
    },
    {
      features: [5, 121, 72, 23, 112, 26, 0, 30],
      label: 0,
    },
    {
      features: [1, 126, 60, 0, 0, 30, 0, 47],
      label: 1,
    },
    {
      features: [1, 93, 70, 31, 0, 30, 0, 23],
      label: 0,
    },
  ],
}
