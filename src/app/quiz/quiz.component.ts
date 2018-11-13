import { Component, OnInit } from '@angular/core';
import { Question } from '../model/question';
import { QuizService } from '../quiz.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  questions: Question[];
  iQuestion = 0;
  currentQuestion: Question;
  answer: string;
  found: boolean;
  hasNext = true;

  constructor(private qS: QuizService, private router : Router) { }

  ngOnInit() {
  }

  newGame(){
    this.hasNext = true; 
    this.qS.score = 0;
    this.qS.buildNewQuiz(10).subscribe(
      value => {
        this.questions = value,
        console.log(this.questions)
        this.currentQuestion = this.questions[this.iQuestion];
      },
      error => console.log(error) 
    )
  }

  loadNextQuestion(){
    this.iQuestion++;
    this.answer='';
    this.currentQuestion = this.questions[this.iQuestion];
  }

  timeSpent(){}

  answerGiven(answer: string){
    if(answer === this.currentQuestion.capitale){
      this.found = true;
      this.qS.score++;
    
    }else{
      this.found = false;
    }
    this.showAnswer()
  }

  showAnswer(){
    this.answer = this.currentQuestion.capitale;
    console.log(this.currentQuestion.capitale);
    this.iQuestion < 3 ? this.hasNext = true : this.hasNext = false;
  }

  redirect() {
    this.router.navigate(['./score']);
  }
}
