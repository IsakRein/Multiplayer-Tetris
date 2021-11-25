# Tetris Fight! (tetris för två spelare)

## Om projektet

Tetris för två personer är dubbelt så roligt som tetris för en person! 
1. Gå in på hemsidan
2. Matchas med en annan person
3. Överlev spelet längre än motspelaren
4. Bli bäst i världen på tetris!

## Installation

Projektet består av två subprojekt: 
1. En server
2. En klient

För att göra programmet testbart läser nu klienten från port 8000 på localhost. Om man vill köra över internet måste klienten ändras på till serverns adress och port. För att testa spellogiken måste flera klienter vara uppkopplade. För att se detta behöver alltså två fönster i webbläsaren öppnas. 

### Krav: 
Node.js installerat https://nodejs.org/en/.

### Server
Servern är skriven i JavaScript med Node.js. För att starta den, kör följande kommandon:

*Byt till rätt directory*
```
cd server
```
*Installera alla bibliotek som servern använder*
```
npm install
```
*Kör programmet och ange (den lokala) porten du vill använda*
```
npm start
```

### Klienten
Klienten använder framförallt React.js (https://reactjs.org/) för att fungera. Öppna ett nytt terminal fönster och kör nedanstående kommandon från projektets directory.

*Byt till rätt directory*
```
cd client
```
*Installera alla bibliotek som servern använder*
```
npm install
```
*Kör programmet och serverns ip och port som du tidigare har ställt in* OBS: använder prompt från node. Fungerar tex i terminal på mac och på powershell.
```
node start.js
```

Öppna flera fönster av klienten för att testa själva spellogiken.
