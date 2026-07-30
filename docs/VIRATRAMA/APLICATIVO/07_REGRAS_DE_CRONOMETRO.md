# Regras de cronometro

Tempo de sala cresce a partir de `started_at`. Entrada e extracao aparecem depois de
liberadas. O alarme cria no servidor um deadline de 720 segundos. Antes disso, o JSON
nao contem `alarm_deadline_at`. Pausa narrativa nao altera o prazo policial. O cliente
calcula apenas a diferenca visual e nao grava a cada segundo.
