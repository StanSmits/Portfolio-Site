import { Calculator } from '../components/Tools';

export const routes = [
  {
    path: '/tools/calculator',
    component: Calculator,
    name: 'Calculator',
  },
] as const;