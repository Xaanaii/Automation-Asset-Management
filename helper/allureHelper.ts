import { allure } from 'allure-playwright';

export function setAllureMeta({ feature }: { feature: string }) {
  allure.label({ name: 'feature', value: feature });
}
