SELECT * FROM programacao
WHERE horaInicio > ?
AND   horaFim < ?
ORDER BY horaInicio