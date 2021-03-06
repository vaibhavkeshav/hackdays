import { Injectable } from '@angular/core';

@Injectable()
export class BestScoreManager {

  private ngWorm = 'ngx_snake';

  public store(score: number) {
    localStorage.setItem(this.ngWorm, JSON.stringify({ 'best_score': score }));
  }

  public retrieve() {
    let storage = this.parse();
    if (!storage) {
      this.store(0);
      storage = this.parse();
    }

    return storage.best_score;
  }

  private parse() {
    return JSON.parse(localStorage.getItem(this.ngWorm));
  }
}
