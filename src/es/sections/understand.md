# Factores que influyen en el impacto ambiental de la IA generativa

Los principales impactos ambientales vinculados al uso de la IA que estudiaremos en este artículo son los siguientes:

- **Las emisiones de gases de efecto invernadero (GEI)** vinculadas a la electricidad y a las demás fuentes de energía necesarias para el funcionamiento de los data centers que ejecutan los modelos de IA;
- **El consumo de agua** para refrigerar los equipos informáticos de los data centers.

Podrían tenerse en cuenta otros impactos, pero, como el tema aún carece un poco de madurez, nos limitaremos a estos dos.

## Los fundamentos: el Large Language Model (LLM)

En un chatbot como ChatGPT, un mecanismo permite generar respuestas que dan la impresión de una conversación real. Es el LLM: Large Language Model. Se trata de un modelo de inteligencia artificial generativa, entrenado con una enorme cantidad de textos para aprender las características y las relaciones entre las palabras y las frases. Su objetivo principal es predecir, a partir del contexto proporcionado, qué palabras son más probables a continuación.

## Los tokens

Los LLM no procesan directamente palabras, sino **tokens**. Un *embedder* (herramienta de transformación) descompone las palabras en tokens antes del procesamiento. Una regla empírica útil consiste en considerar que un token corresponde generalmente a unos 4 caracteres en un texto inglés corriente. Esto equivale a aproximadamente tres cuartos de una palabra (así, 100 tokens corresponden a unas 75 palabras) [@openai2026tokenizer].

**Ejemplo de segmentación:**
«Impacting the environment» se descompone en 4 tokens: «Impact / ing / the / environment»

Los diseñadores de LLM utilizan *embedders* distintos, lo que significa que un mismo texto puede producir un número de tokens variable según el modelo.

Los tokens pueden dividirse en dos categorías: 
- los tokens de entrada (también llamados: tokens de input, de instrucción, del usuario o enviados)
- los tokens de salida (también llamados: tokens de output, generados, del asistente o recibidos).

### Cuantos más tokens debe procesar la IA, más energía consume

El número de tokens de salida es, en teoría, proporcional al consumo total de energía. 

**Ejemplo:** Un intercambio que requiere procesar **10 tokens** consume **la mitad de energía** que una solicitud que procesa **20 tokens**.

### Los tokens de salida suelen consumir más energía que los de entrada

Algunos estudios muestran que el procesamiento de un intercambio con un mensaje enviado largo (por ejemplo, 50 000 tokens) consume solo ligeramente más energía que mensajes enviados cortos [@Caravaca2026]. Esto hace suponer que el consumo de un token de entrada es despreciable en comparación con el de un token de salida.
En realidad, su consumo varía mucho en función de la longitud total del mensaje. Puede ser menor cuando el mensaje es corto, pero mayor cuando el mensaje es largo. Lo mismo ocurre con los tokens de salida [@vartziotis2026tokenswatthoursanalyticalenergy; @373c7a76c4004545bb3bb80df83f2932].

**Modelo simplificado** :
Una solicitud con **1000 tokens de entrada** y **50 tokens de salida** consumirá en teoría **menos energía** que una solicitud con **50 tokens de entrada** y **1000 tokens de salida**.

Suponiendo que la mayoría de los intercambios con un chatbot son largos, no puede considerarse que el consumo de un token de entrada sea despreciable [@ruf2026cost]. 

**Regla general** : cuantos menos tokens de salida procesa una solicitud, menos energía consumirá. Ocurre lo mismo con los tokens de entrada, pero en general de forma menos acusada que con los tokens de salida.

### Los tokens de razonamiento se suman a los tokens de salida

Un modelo de razonamiento produce primero un texto de planificación en el que se apoya para elaborar su respuesta final.
Los tokens generados por el modelo de razonamiento a veces **no son visibles** para el usuario. Un token de razonamiento consume **tanta energía** como un token de salida. Aumentan el **número total de tokens procesados** por el LLM y, por tanto, su consumo energético [@felipe2026reasoning].


Así, comprendemos que el número de tokens procesados, en particular los tokens de salida, tiene un fuerte impacto en el impacto ambiental.
Para medir este impacto y cuantificar su huella energética, de carbono e hídrica, pueden seguirse tres indicadores clave:

- las emisiones de GEI, expresadas en masa de dióxido de carbono equivalente (gCO₂e);
- el consumo de energía, expresado en vatios-hora (Wh);
- el consumo de agua, expresado en volumen (L o m³).

Estos indicadores se aplican tanto a los tokens de entrada como a los de salida.

## El papel fundamental del centro de datos

Una IA generativa, como un LLM, es un programa que se ejecuta en un ordenador. Puede ser su equipo personal, pero generalmente se hace en centros de datos (data centers). Su funcionamiento requiere energía, lo que genera un impacto ambiental, medido aquí en **gCO₂e/kWh**.

Los distintos servicios que permiten utilizar un LLM, y que consumen energía, son los siguientes:

- **Alojamiento en un data center público** (Microsoft Azure, Amazon Web Services, Google Cloud Platform): la IA se ejecuta en servidores de un data center perteneciente a una empresa (cloud) en lugar de directamente en su ordenador. Estos servidores son muy potentes y permiten ejecutar modelos de IA que se han descargado o que se han desarrollado y entrenado por cuenta propia. En ese caso, se es propietario de la IA y se elige el proveedor de cloud y la región geográfica en la que se ejecutará.
- **Alojamiento en un data center propio**: generalmente reservado a las empresas, el principio de funcionamiento es similar al del cloud público: se posee la IA y se decide la ubicación de la máquina en la que hacerla funcionar.
- **En los data centers de los proveedores de IA** oficiales como OpenAI, Anthropic (Claude), Google, Mistral AI, Meta, DeepSeek, Z.ai, Moonshot AI o de agregadores como OpenRouter, Vercel, Groq y MammouthAI. Aquí no se controla nada del funcionamiento de la IA. Puede estar alojada en un data center privado o en un proveedor de cloud público (a nombre del proveedor o del agregador).
- **En su ordenador**: algunas IA recientes y pequeñas pueden funcionar directamente en su ordenador, ofreciendo rendimientos competitivos frente a los grandes modelos propietarios [@saadfalcon2026intelligencewattmeasuringintelligence]. Así se controla el 100 % del consumo energético vinculado a su uso y se puede utilizar la IA generativa sin conexión.

### El coste de la producción de electricidad por país

Cada país produce electricidad con un impacto ambiental variable. Para generar **1 kWh**, una central emite GEI y consume agua. 

Algunos organismos proporcionan los factores de emisión de carbono de cada país (en gCO₂e/kWh producido):
- la **International Energy Agency** (IEA), normalmente de pago pero accesible gratuitamente previa solicitud;
- la **ADEME**, gratuita pero que recoge los datos de la IEA de 2011 [@ademe2026];
- Ember Energy, gratuita y que recoge datos de 2025 de la IEA, Eurostat, BP y UN [@ember_yearly_electricity_data];
- Spectrum IEEE, gratuita y por país o tipo de producción [@jones2008water].

Según Ember Energy, estos factores pueden ir desde algo más de 20 (Islandia) hasta más de 800 gCO₂e/kWh (Mongolia). La **ubicación de los servidores** desempeña un papel principal en el impacto ambiental de la IA.

### Los data centers deben refrigerarse

Durante el uso de los servidores, la electricidad recibida se convierte en calor.
Para mantener su buen funcionamiento, los servidores de un data center deben mantenerse a una temperatura óptima.
Para evacuar el calor, los data centers utilizan diferentes métodos de refrigeración [@le_goff2023], entre ellos:

- **La refrigeración directa por aire exterior**:
Posible en regiones de clima fresco, este método ventila aire exterior para refrigerar los servidores. Consume electricidad principalmente para alimentar los ventiladores y no consume agua.
- **La refrigeración adiabática**:
El aire caliente exterior se ventila y se enfría mediante la pulverización de finas gotas de agua que se evaporan en contacto con él. Este método consume tanto electricidad como agua.
- **La refrigeración directa de los chips (*Direct Chip Cooling*)**:
Circula agua por microtuberías entre los componentes de los servidores para refrigerarlos directamente. Aunque el agua no se consume, en algún momento del circuito debe enfriarse, lo que a menudo requiere energía. Además, esta agua puede ser movilizada por el data center durante períodos de alta demanda (por ejemplo, para el consumo humano o el riego agrícola en verano), lo que puede plantear problemas de competencia de usos.


#### El consumo de agua puede medirse

El **WUE** (*Water Usage Effectiveness*) es un indicador que mide la cantidad de agua consumida por los data centers [@green_grid2011_wue].
Esta agua llamada consumida es en realidad evaporada a la atmósfera. El agua extraída del medio ambiente y devuelta más tarde no se tiene en cuenta en el cálculo de este indicador.

**Fórmula:** WUE (L/kWh) = Agua consumida (L) / Energía consumida por los servidores (kWh)

El WUE depende principalmente de la ubicación del data center y de sus métodos de refrigeración.
Los que se encuentran en regiones áridas tienen un WUE generalmente más alto y, por tanto, movilizan más agua durante los períodos de mucho calor.

| **WUE (L/kWh)** | **Fuente** | **Consumo de agua anual (m³)** | **Equivalente (piscinas olímpicas)** |
|:----------------|:-----------------------|----------:|------:|
| 0,12  | Amazon                | Desconocido   | --    |
| 0,255 | Microsoft             | 8.170.000 | 3.268 |
| 0,29  | OVH France Roubaix    | Desconocido   | --    |
| 0,19  | Meta Texas Fort Worth | 195.000   | 78    |

Table: WUE y consumo de agua de los proveedores de cloud {#tab:cloud-providers-wue}

Fuente: Informes ambientales

### Índice de eficiencia energética: el PUE

Un mismo servidor consume la misma cantidad de energía, **sea cual sea su ubicación**. 
Sin embargo, la energía para mantenerlo a una temperatura óptima varía en función del clima. Así, se necesita más o menos energía para refrigerarlo según su ubicación.

El indicador que permite medir la eficiencia energética de un data center, en particular en lo que respecta a la refrigeración y al mantenimiento de la infraestructura, es el **PUE** (*Power Usage Effectiveness*) [@Malone2006]. Representa la razón entre:

- **el consumo total del data center**;
- **el consumo vinculado únicamente al funcionamiento de los servidores**.

**Fórmula:** PUE = Consumo total del data center (kWh) / Consumo de los servidores del data center (kWh)

**Ejemplos de interpretación:**

- **PUE = 1**: ideal. Toda la energía se utiliza únicamente para hacer funcionar los servidores.
- **PUE > 1**: además de la energía para hacer funcionar los servidores, el data center consume también energía para refrigerarlos.
- **PUE = 2**: se consume tanta energía para alimentar los servidores como para refrigerarlos.
- **PUE > 2**: muy malo. Se consume más energía para refrigerar los servidores que para alimentarlos.

El PUE medio mundial es de 1,54 [@taylor2026], mientras que el de Google es de 1,09 [@google2026pue].

El **PUE** de los data centers es un criterio clave a la hora de elegir un proveedor cloud y la región de alojamiento.

## La elección del modelo de IA utilizado

### El tamaño del modelo

El tamaño de un modelo de lenguaje se mide por su número de parámetros. **Cuantos más parámetros activados tiene un modelo durante su ejecución, mayor es su consumo energético por token**. Este consumo es directamente proporcional al número de parámetros.

**Ejemplo:** un modelo con 100 000 millones de parámetros consume **la mitad de electricidad** para procesar un token que un modelo con 200 000 millones de parámetros [@mistralai2025environmental].

Esta regla no se aplica necesariamente a todos los proveedores de modelos. En efecto, cada uno utiliza métodos de diseño diferentes, lo que influye en el consumo energético de los modelos [@Zschache2026]. Sin embargo, puede aplicarse generalmente a todos los de una misma familia: los modelos GPT-6 entre sí, los modelos Gemini 3 entre sí, etc.
Así, aunque esta regla no sea universal para comparar todos los modelos entre sí, sigue siendo un indicador fiable para orientar la elección de un modelo dentro de un mismo proveedor.

**Transparencia de los proveedores** :
Los modelos de código abierto (open source) muestran su número de parámetros. Pero el de los modelos de proveedores privados como OpenAI, Anthropic o Google nunca se divulga. No obstante, es posible ordenar por tamaño los modelos de un mismo proveedor gracias a sus denominaciones: *luna, lite, small, nano, mini < terra, flash, medium < sol, pro, large, plus, max*.
Algunos trabajos intentan cuantificar este número de parámetros basándose en diversos métodos innovadores, como la comparación del volumen de conocimiento almacenado [@li2026incompressibleknowledgeprobesestimating].

| **Modelo** | **Proveedor** | **Parámetros estimados** |
|:------------------|:----------|:-----|
| gpt-5.5           | OpenAI    | 5.300.000.000.000 |
| claude-fable-5    | Anthropic | 3.500.000.000.000 |
| gemini-2.5-pro    | Google    | 3.000.000.000.000 |
| grok-4            | xAI       | 2.000.000.000.000 |
| claude-sonnet-4.6 | Anthropic |   760.000.000.000 |

Table: Estimación de los parámetros de modelos propietarios con el método « Incompressible Knowledge Probes » [@li2026incompressibleknowledgeprobesestimating] {#tab:proprietary-model-parameters}

Fuente: [https://01.me/research/ikp/#/calibration#proprietary](https://01.me/research/ikp/#/calibration#proprietary)

También es posible estimar el tamaño de los modelos propietarios comparando su precio con el de modelos abiertos. Sin embargo, este método es muy incierto, ya que la bajada del precio puede significar una optimización en lugar de una disminución del número de parámetros [@du2026tieredsupermooreslawprice].

### Los modelos MoE solo activan los parámetros útiles

Un modelo **MoE** (*Mixture of Experts*) es un tipo de modelo que **no utiliza la totalidad de sus parámetros** durante su ejecución. Esto no lo hace menos eficaz; al contrario, activa únicamente los parámetros necesarios para generar la respuesta. Por ejemplo, un modelo MoE de 300 000 millones de parámetros puede activar solo 30 000 millones, lo que lo hace **mucho menos voraz en energía** que un modelo denso de 100 000 millones de parámetros [@mu2026comprehensivesurveymixtureofexpertsalgorithms].
Al activar un **bajo número de parámetros**, los modelos MoE reducen el consumo energético del procesamiento de un token.

## Motores de inferencia

El consumo energético de un LLM durante la ejecución no está determinado únicamente por el propio modelo: depende también del motor de inferencia utilizado [@niu2025inferenceengine].
Un motor de inferencia es, en cierto modo, el software que hace funcionar un LLM en el momento en que se le plantea una pregunta.
Si el LLM fuera el motor de un coche, el motor de inferencia sería el sistema que organiza y controla su funcionamiento.
Algunos proveedores optimizan sus modelos para determinados motores de inferencia [@nvidia2026llminference].
