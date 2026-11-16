import type { DataSet } from '../../model/data-types'
import { msg } from '@lit/localize'

export const bostonHousePricing: DataSet = {
  name: msg('Boston House Pricing'),
  description: msg(
    'The Boston House Price data set involves the prediction of a house price in thousands of dollars given details of the house and its neighborhood.',
  ),
  type: 'regression',
  featureDescs: [
    {
      key: 'CRIM',
      description: msg('Per capita crime rate by town'),
    },
    {
      key: 'ZN',
      description: msg(
        'Proportion of residential land zoned for lots over 25,000 sq.ft.',
      ),
    },
    {
      key: 'INDUS',
      description: msg('Proportion of nonretail business acres per town'),
    },
    {
      key: 'CHAS',
      description: msg(
        'Charles River dummy variable (= 1 if tract bounds river; 0 otherwise)',
      ),
    },
    {
      key: 'NOX',
      description: msg('Nitric oxides concentration (parts per 10 million)'),
    },
    {
      key: 'RM',
      description: msg('Average number of rooms per dwelling'),
    },
    {
      key: 'AGE',
      description: msg(
        'Proportion of owner-occupied units built prior to 1940',
      ),
    },
    {
      key: 'DIS',
      description: msg('Weighted distances to five Boston employment centers'),
    },
    {
      key: 'RAD',
      description: msg('Index of accessibility to radial highways'),
    },
    {
      key: 'TAX',
      description: msg('Full-value property-tax rate per $10,000'),
    },
    {
      key: 'PTRATIO',
      description: msg('Pupil-teacher ratio by town'),
    },
    {
      key: 'B',
      description: msg(
        '1000(Bk – 0.63)^2 where Bk is the proportion of blacks by town',
      ),
    },
    {
      key: 'LSTAT',
      description: msg('% lower status of the population'),
    },
  ],
  labelDesc: {
    key: 'MEDV',
    description: msg('Median value of owner-occupied homes in $1000s'),
  },
  // the rows load on demand, see DataSetUtils.loadData
  data: [],
}
