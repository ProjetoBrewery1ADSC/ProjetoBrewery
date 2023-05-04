
int lm35_pin = A0, leitura_lm35 = 0;
float temperatura;

void setup()
{
Serial.begin(9600);

}
void loop()
{

// temp Maceracao
leitura_lm35 = analogRead(lm35_pin);
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.println(";");

// temp Malteacao
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.println(";");

// temp Moagem
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.println(";");

// temp Brassagem
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.println(";");

// temp Fervura
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.println(";");

// temp Resfriamento
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.println(";");

// temp Maturacao
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.println(";");

// temp Filtragem
leitura_lm35 = analogRead(lm35_pin);
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.println(";");

// temp Pasteurização Rápida
leitura_lm35 = analogRead(lm35_pin);
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.println(";");

// temp Túnel de Pasteurização
temperatura = leitura_lm35 * (5.0/1023) * 100;
Serial.print(temperatura);
Serial.println(";");

delay(2000);

}