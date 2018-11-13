import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Question } from "./model/question";


@Injectable({
  providedIn: 'root'
})

export class QuizService {
  public score: number
  private _nbQuestions

  constructor(private http: HttpClient) { }

  buildNewQuiz(nbQuestions: number): Observable<Question[]> {
    if (nbQuestions < 1 || nbQuestions > 20) {
      throw new Error('Le quiz doit être composé d\'entre 1 et 20 questions')
    }
    this._nbQuestions = nbQuestions
    return new Observable((observer) => {
      this.http.get('http://localhost:3000/questions').subscribe(
        (questions: Question[]) => {
          this.shuffle(questions)
          const quizQuestions = questions.slice(0, nbQuestions)
          for (const question of quizQuestions) {
            question.propositions = [question.capitale, ...(this.findThreeRandomPropositionsForContinent(questions, question.continent))]
            this.shuffle(question.propositions)
          }
          observer.next(quizQuestions)
          observer.complete()
        }, error => {
          observer.error(error)
        }
      )
    })
  }

  private shuffle(a: any[]): any[] {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

  private findThreeRandomPropositionsForContinent(questions: Question[], continent: string): string[] {
    const questionShuffled = this.shuffle(Object.assign([], questions))
    const propositions: string[] = []
    questionShuffled.forEach(q => {
      if (propositions.length < 3 && q.continent === continent) {
        propositions.push(q.capitale)
      }
    })
    return propositions
  }

  get nbQuestions() {
    return this._nbQuestions
  }
}
