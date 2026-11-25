import type { DataSet } from '../../model/data-types'
import { msg } from '@lit/localize'

export const pimaIndiansDiabetes: DataSet = {
  name: msg('Pima Indians Diabetes'),
  description: msg(
    'The Pima Indians Diabetes data set involves predicting the onset of diabetes within 5 years in Pima Indians given medical details. It is a binary (2-class) classification problem. The number of observations for each class is not balanced. There are 768 observations with 8 input variables and 1 output variable. Missing values are believed to be encoded with zero values.',
  ),
  type: 'classification',
  featureDescs: [
    {
      key: 'PREG',
      description: msg('Number of times pregnant'),
    },
    {
      key: 'GLUC',
      description: msg(
        'Plasma glucose concentration a 2 hours in an oral glucose tolerance test.',
      ),
    },
    {
      key: 'BLOOD',
      description: msg('Diastolic blood pressure (mm Hg)'),
    },
    {
      key: 'SKIN',
      description: msg('Triceps skinfold thickness (mm)'),
    },
    {
      key: 'INS',
      description: msg('2-Hour serum insulin (mu U/ml)'),
    },
    {
      key: 'BMI',
      description: msg('Body mass index (weight in kg/(height in m)^2)'),
    },
    {
      key: 'PEDI',
      description: msg('Diabetes pedigree function'),
    },
    {
      key: 'AGE',
      description: msg('Age (years)'),
    },
  ],
  labelDesc: {
    key: 'DIA',
    description: msg('Diabetes'),
    classes: [
      {
        id: 0,
        description: msg('No'),
      },
      {
        id: 1,
        description: msg('Yes'),
      },
    ],
  },
  // the rows load on demand, see DataSetUtils.loadData
  data: [],
}
