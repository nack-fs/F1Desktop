"use strict";

class Memoria {
    hasFlippedCard;
    lockBoard;
    firstCard;
    secondCard;

    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        this.shuffleElements(elements);
        this.createElements();
        this.addEventListeners();
    }

    shuffleElements(elements) {
        const shuffled = elements.members.slice();
        const size = shuffled.length;

        for (let i = size - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        elements.members = shuffled;
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.dataset.state = 'hidden';
            this.secondCard.dataset.state = 'hidden';
            this.resetBoard();
        }, 1000);
    }

    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    checkForMatch() {
        const isMatch = this.firstCard.dataset.element === this.secondCard.dataset.element;
        isMatch ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        this.firstCard.dataset.state = 'revealed';
        this.secondCard.dataset.state = 'revealed';
        this.resetBoard();
    }

    createElements() {
        const container = document.querySelector('main')
        
        elements.members.forEach((card) => {
            const article = document.createElement('article')
            article.setAttribute('data-element', card.element)
            article.setAttribute('data-state', 'hidden')
    
            const heading = document.createElement('h3')
            heading.textContent = "Tarjeta de memoria"
            article.appendChild(heading)
    
            const image = document.createElement('img')
            image.src = card.source
            image.alt = card.element
            article.appendChild(image)
    
            container.appendChild(article)
        })
    }        

    flipCard(card) {
        if (this.lockBoard) return;
        if (card.dataset.state === 'revealed') return;
        if (card === this.firstCard) return;

        card.dataset.state = 'flip';

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = card;
            return;
        }

        this.secondCard = card;
        this.lockBoard = true;
        setTimeout(() => this.checkForMatch(), 1000);
    }

    addEventListeners() {
        const cards = document.querySelectorAll('main article');
        cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(this, card));
        });

        const ayuda = document.querySelector('button');
        ayuda.addEventListener('click', this.helpButton);
    }

    helpButton() {
        const ayuda = document.querySelector('button');
        const h2 = document.querySelector('h2');
    
        const instrucciones = document.createElement('ol');
        instrucciones.innerHTML = `<li>Haz clic en dos cartas para voltearlas y ver su contenido.</li>
            <li>Si las cartas tienen la misma imagen (pareja), permanecerán volteadas.</li>
            <li>Si las cartas no coinciden, se voltearán nuevamente después de unos segundos.</li>
            <li>El objetivo es encontrar todas las parejas de cartas lo más rápido posible.</li>`;
    
        h2.insertAdjacentElement('afterend', instrucciones);
        ayuda.remove();
    }
}

const elements = {
    members: [
        { "element": "RedBull", "source": "multimedia/Red_Bull_Racing_logo.svg" },
        { "element": "RedBull", "source": "multimedia/Red_Bull_Racing_logo.svg" },
        { "element": "McLaren", "source": "multimedia/McLaren_Racing_logo.svg" },
        { "element": "McLaren", "source": "multimedia/McLaren_Racing_logo.svg" },
        { "element": "Alpine", "source": "multimedia/Alpine_F1_Team_2021_Logo.svg" },
        { "element": "Alpine", "source": "multimedia/Alpine_F1_Team_2021_Logo.svg" },
        { "element": "AstonMartin", "source": "multimedia/Aston_Martin_Aramco_Cognizant_F1.svg" },
        { "element": "AstonMartin", "source": "multimedia/Aston_Martin_Aramco_Cognizant_F1.svg" },
        { "element": "Ferrari", "source": "multimedia/Scuderia_Ferrari_Logo.svg" },
        { "element": "Ferrari", "source": "multimedia/Scuderia_Ferrari_Logo.svg" },
        { "element": "Mercedes", "source": "multimedia/Mercedes_AMG_Petronas_F1_Logo.svg" },
        { "element": "Mercedes", "source": "multimedia/Mercedes_AMG_Petronas_F1_Logo.svg" }
    ]
};

const juegoMemoria = new Memoria();