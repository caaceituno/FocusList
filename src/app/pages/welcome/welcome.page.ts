import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  pages = [
  {
    text: 'FocusList tu agenda personal para convertir pendientes en planes simples y manejables.',
    bg: '/assets/img/background01.png',
  },
  {
    text: 'Crea listas, añade tareas y mantén todo bajo control sin complicaciones.',
    bg: '/assets/img/background02.png',
  },
  {
    text: 'Conecta con tu calendario y visualiza tu progreso día a día.',
    bg: '/assets/img/background03.png',
  },
  {
    text: 'Tu productividad, tu ritmo. Sin ruido, sin fricción.',
    bg: '/assets/img/background04.png',
  },
];

  toggleCard() {
    const cardInner = document.querySelector('.card-inner');
    if (cardInner) {
      cardInner.classList.toggle('active'); // Alterna la clase 'active' en cada clic
    }
  }

}
