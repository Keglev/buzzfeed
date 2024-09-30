import { Component } from '@angular/core';

import quizz_questions from "../../../assets/data/quizz_questions.json";

import { TranslateService } from '@ngx-translate/core';

type Language = 'en' | 'de' | 'pt';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.css'
})

export class QuizzComponent {
  title:string="";

  questions:any;
  questionSelected: any;

  answers:string[] = [];
  answerSelected: string ="";

  questionIndex:number = 0;
  questionMaxIndex:number = 0;
  finished:boolean = false;

  currentLang: Language = 'en';

  constructor(private translate: TranslateService) {
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang as Language;
      this.loadQuiz();
    });
  }

  ngOnInit(): void {
    this.loadQuiz();
  }

  loadQuiz() {

    const quizData = quizz_questions[this.currentLang as keyof typeof quizz_questions];

    if(quizData){
      this.finished = false;
      this.title = quizData.title;
      this.questions = quizData.questions;

      this.questionIndex = 0;
      this.questionMaxIndex = this.questions.length;
      this.questionSelected = this.questions[this.questionIndex];
    }
  }

  retakeQuiz() {
    this.finished = false;
    this.answers = [];
    this.questionIndex = 0;
    this.questionSelected = this.questions[this.questionIndex];
  }


  playerChoose(value:string){
    this.answers.push(value)
    this.nextStep()
  }

  async nextStep(){
    this.questionIndex +=1

    if(this.questionMaxIndex > this.questionIndex){
        this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer:string = await this.checkResult(this.answers);
      this.finished = true;

      const currentQuiz = quizz_questions[this.currentLang as keyof typeof quizz_questions];
      const results = currentQuiz.results as { [key:string]: string };
      this.answerSelected = results[finalAnswer as keyof typeof results];
      // Verify the win option
    }
  }

  async checkResult(answers:string[]){
    const result = answers.reduce((previous, current, i, arr) => {
      if(
        arr.filter(item => item === previous).length >
        arr.filter(item => item === current).length
      ){
        return previous
      }else{
        return current
      }
    })
    return result
  }

}
