# Othello
En variant av Othello (eller Reversi) med ett 6x6-bräde, byggd med HTML + CSS + Javascript.

Spelbrädet representeras av ett rutnät av HTML-element. De svarta resp. vita cirklarna representerar markörer. De gråa cirklarna representerar giltiga drag. Spelare väljer drag genom att klicka på en av dessa gråmarkerade rutor, men det går även att välja drag manuellt genom konsolen. Nuvarande spelare och respektive spelares poäng representeras vid sidan av brädet.

![DjguQ5TmdL](https://user-images.githubusercontent.com/59237624/206496836-26593f75-be43-4773-9e80-8a4219b057da.png)

## Regler
Reglerna är identiska till "vanliga" Othello. Ett giltigt drag är ett som lägger en markör på en tom ruta och resulterar i att minst en av motståndarens markörer hamnar mellan den nyligen lagda markören och en av spelarens existerande markörer, såväl vertikalt och horisontellt som diagonalt. De av motståndarens markörer som hamnar mellan blir spelarens markörer, och byter färg. Spelet slutar när det inte finns några giltiga drag kvar, och spelaren med flest poäng vinner. Spelarens poäng motsvarar antalet markörer på brädet av spelarens färg.
