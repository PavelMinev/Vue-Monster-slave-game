function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            playerOldHealth: 100,
            monsterHealth: 100,
            monsterOldHealth: 100,
            attackDelay: 400,
            currentRound: 0,
            winner: null,
            logMessages: [],
        };
    },
    computed: {
        monsterBarStyles() {
            return {width: this.monsterHealth + '%'}
        },
        monsterBar2Styles() {
            return {width: this.monsterOldHealth + '%'}
        },
        playerBarStyles() {
            return {width: this.playerHealth + '%'}
        },
        playerBar2Styles() {
            return {width: this.playerOldHealth + '%'}
        },
        mayUseSpecialAttack() {
            return this.currentRound % 3  !== 0;
        }
    },
    watch: {
        playerHealth(value) {
            setTimeout(() => {
                this.playerOldHealth = value;
            }, this.attackDelay - 100);
            if (value === 0) {
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            setTimeout(() => {
                this.monsterOldHealth = value;
            }, this.attackDelay - 100);
            if (value === 0) {
                if (value === 0) {
                    this.winner = 'player';
                }
            }
        }
    },
    methods: {
        startGame() {
          this.playerHealth = 100;
          this.monsterHealth = 100;
          this.winner = null;
          this.currentRound = 0;
          this.logMessages = [];
        },
        attackMonster() {
            if (this.winner) {
                return;
            }
            this.currentRound++;
            const damage = getRandomValue(5, 12);
            const newHealth = Math.max(0, this.monsterHealth - damage);
            this.monsterHealth = newHealth;
            this.addLogMessage('player', 'attack', damage);
            setTimeout(() => {
                this.attackPlayer();
            }, this.attackDelay);
        },
        attackPlayer() {
            if (this.winner) {
                return;
            }
            const damage = getRandomValue(8, 12);
            const newHealth = Math.max(0, this.playerHealth - damage);
            this.playerHealth = newHealth;
            this.addLogMessage('monster', 'attack', damage);
        },
        specialAttackMonster() {
            if (this.winner) {
                return;
            }
            this.currentRound++;
            const damage = getRandomValue(10, 25);
            const newHealth = Math.max(0, this.monsterHealth - damage);
            this.monsterHealth = newHealth;
            this.addLogMessage('player', 'attack', damage);
            setTimeout(() => {
                this.attackPlayer();
            }, this.attackDelay);
        },
        healPlayer() {
            if (this.winner) {
                return;
            }
            this.currentRound++;
            const healValue = getRandomValue(8, 20);
            this.playerHealth = Math.min(100, this.playerHealth + healValue);
            this.playerOldHealth = this.playerHealth;
            this.addLogMessage('player', 'heal', healValue);
            setTimeout(() => {
                this.attackPlayer();
            }, this.attackDelay);
        },
        surrender() {
            this.playerHealth = 0;
            this.winner = 'monster';
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    }
});

app.mount('#game');
