import { demoget } from './demo.entity';

export default function demo() {
  this.route.get('/demo', demoget(this));// don't forget to pass this.
}
