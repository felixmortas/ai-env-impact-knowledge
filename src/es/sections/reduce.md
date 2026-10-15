# Reducir el impacto ambiental aplicando buenas prácticas

En este capítulo descubrirá qué buenas prácticas conviene aplicar para reducir su impacto ambiental relacionado con la IA, y por qué aplicarlas puede incluso mejorar su eficacia.

Existen buenas prácticas adaptadas a dos categorías de público:

- **El usuario final**: afectan a la manera en que se utiliza la aplicación de IA.
- **El desarrollador de IA**: influyen en la manera en que funciona la aplicación de IA.

En ambos casos, estas buenas prácticas buscan **minimizar su huella ecológica** y, al mismo tiempo, **optimizar su rendimiento**.

Algunos actores como la ONU también proponen palancas de reducción que se presentarán en este capítulo [@aczel2026environmental].

## Como usuario de un chatbot

### Priorizar una búsqueda en un motor de búsqueda

Si la respuesta que espera a su pregunta es sencilla (por ejemplo, el número de habitantes de una ciudad o la familia de una planta), es preferible hacer una búsqueda en un motor de búsqueda (Google, Ecosia, Bing, Qwant, Brave, DuckDuckGo).

Si tiene el reflejo de formular su pregunta en su chatbot con palabras clave para ahorrar tiempo, tenga en cuenta que puede introducir directamente esas palabras clave en su motor de búsqueda. La respuesta será igual de rápida y accesible a través de varias fuentes.
*Ejemplos: «Planeta más grande sistema solar», «velocidad de la luz».*

Google estima que una búsqueda media en su motor de búsqueda consume **0,3 Wh** de energía y emite 0,2 gCO₂e en 2009 [@holzele2009powering], pero es muy probable que este valor ya no sea válido. Un estudio reciente estima los nuevos valores en 0,03 Wh y 0,02 gCO₂e, es decir, 10x menos que antes [@vanderbauwhede2025estimatingincreaseemissionscaused].
Como comparación, Mistral AI estima que una consulta dirigida a su modelo Mistral Large 2 con 400 tokens de salida emite 1,14 gCO₂e [@mistralai2025environmental].

**Atención**: en sus búsquedas con Google u otros motores, la funcionalidad de **búsqueda por IA automática (AI Overview)** está activada por defecto. Debe desactivarla en los ajustes para que esta buena práctica sea válida y elegir usted mismo cuándo usar la IA en sus búsquedas.

### Utilizar un modelo con pocos parámetros activados

Cuando use un chatbot, elija **el modelo más pequeño**, con el menor número de parámetros activados. Es suficiente para realizar con precisión muchas tareas [@chen2023frugalgptuselargelanguage ; @cao2026taskspecificefficiencyanalysissmall].

La mayoría de los proveedores de IA no comunican ni el nombre exacto del modelo utilizado ni el número de parámetros que contiene. Sin embargo, a modo de orientación, tenga en cuenta que los modelos cuyos nombres incluyen términos como *«flash»*, *«lite»*, *«rápido»*, *«nano»*, *«mini»*, *«quick»* o *«small»* suelen ser los que activan **el menor número de parámetros por token procesado**.

**Recomendaciones para elegir el modelo en función de la tarea que se va a realizar:**
- Pequeño: profundizar en un tema, reformular o resumir un texto, generar un fragmento de código básico, clasificar, extraer texto.
- Intermedio: planificar, diseñar una arquitectura, generar código dentro de un proyecto, realizar un tratamiento no estandarizado.
- Grande: resolver un problema complejo de matemáticas, ciencias o ingeniería, diseñar una arquitectura compleja, realizar una planificación compleja, analizar expedientes voluminosos con fuentes contradictorias.

Ya lo habrá entendido: los grandes modelos están sobredimensionados para muchos casos de uso.

Con los modelos GPT-5 en ChatGPT, no puede elegir manualmente el modelo utilizado. Un primer modelo, llamado *«router»*, determina automáticamente el tamaño del modelo que procesará su mensaje.
Para los usuarios gratuitos, todas las consultas se envían al modelo más pequeño [@openai2026gpt56sol].

Para incitar al router a dirigir su mensaje a un modelo en concreto, puede incluir palabras clave como:
*«Responde de forma sencilla»* o *«Sin razonar»* para utilizar un modelo pequeño.
*«Piensa paso a paso»* o *«Razona antes de responder»* para utilizar un modelo más potente o un razonamiento [@anthropic2025prompt].

### Reducir el esfuerzo de reflexión

Se recomienda **utilizar la funcionalidad de razonamiento** únicamente cuando la respuesta a su consulta requiera un análisis complejo, no trivial, y deba descomponerse en varios pasos para garantizar la mejor calidad posible. Puede elegir activar o no el razonamiento en los chatbots de Google, DeepSeek y Mistral.

Algunos modelos, como GPT o Claude, permiten configurar distintos niveles de esfuerzo. Este parámetro determina el número de tokens de razonamiento y de salida que genera. Aunque a menudo se considera que un razonamiento más largo conduce a mejores resultados, no siempre es así. El rendimiento tiende primero a mejorar a medida que aumenta el esfuerzo, hasta alcanzar un punto óptimo y, en algunos casos, empeorar más allá de ese umbral [@wu2025lessunderstandingchainofthoughtlength].
Por tanto, es preferible elegir un nivel de esfuerzo bajo o moderado.

### Prompt engineering

Esta sección explica la importancia del *prompt/context engineering*: **cómo proporcionar un contexto útil al chatbot eliminando el ruido** (es decir, la información innecesaria) para que realice su tarea con precisión y genere una respuesta en el formato deseado.

Según los principales proveedores de modelos, entre ellos OpenAI [@openai_prompt_engineering], la estructura óptima de un prompt se basa en varios elementos clave, entre ellos:

1. **Contexto**: la parte que suele ser más larga, que se puede **reducir considerablemente** para minimizar el número de tokens de entrada y aclarar la petición.
2. **Tarea**: generalmente formulada en una frase.
3. **Entregable**: breve, pero esencial para **limitar el número de tokens de salida**.

#### Optimizar el contexto para reducir los tokens de entrada

Hemos visto anteriormente que los tokens de entrada también influyen en el consumo energético de la consulta [@ruf2026cost]. Por tanto, se recomienda limitar el contexto para reducir el impacto ambiental, pero también para mejorar la calidad de la respuesta.

#### Optimizar el entregable para reducir los tokens de salida

Hemos visto anteriormente que **el impacto energético de los tokens generados en la salida es mayor que el de los tokens de entrada** [@Caravaca2026]. Por tanto, suele ser más eficaz, desde el punto de vista energético, **alargar el prompt enviado** para intentar reducir la longitud de la respuesta.

En la mayoría de los casos, **una respuesta corta y concisa basta** y evita perderse en explicaciones innecesarias.

**Ejemplos de instrucciones para limitar la longitud de la respuesta:**
- Para corregir faltas de ortografía en un texto largo:
  *«Indica únicamente las correcciones que hay que hacer, sin explicaciones y sin copiar de nuevo todo el texto.»*
- Para corregir código:
  *«Reescribe únicamente las partes que hay que modificar sin reproducir todo el código. No des explicaciones.»*
- Para reformular un párrafo dentro de un texto:
  *«Reescribe únicamente el párrafo que hay que modificar, sin copiar de nuevo el resto del texto.»*

Le corresponde a usted determinar lo que necesita para obtener **la respuesta esperada, y nada más si no es necesario**.

**Consejo**: algunos chatbots, como Claude, ofrecen seleccionar el tipo de respuesta. Elija las opciones *«cortas»* o *«concisas»*.

Por el contrario, el uso de ciertos verbos de acción como «justifica», «explica», «analiza» o «recomienda» tiende a aumentar la cantidad de texto generado [@adamska2026greenpromptingcharacterizingpromptdriven].

### Detener la generación

Si desde el comienzo de la respuesta del chatbot comprueba que **no se corresponde en absoluto** con lo que espera, **interrúmpala de inmediato** pulsando el botón *«Stop»* (generalmente representado por un cuadrado relleno ⏹️).

Esta sencilla acción permite **reducir el número de tokens generados en la salida** al evitar una respuesta inútil.

### Modificar la petición inicial en lugar de enviar un mensaje nuevo

Cuando la respuesta generada es **incompleta, interrumpida o insatisfactoria** (un elemento olvidado en el contexto, un detalle impreciso, una parte que hay que eliminar), **es preferible modificar el mensaje inicial** en lugar de enviar uno nuevo para afinar su petición.

Con cada nuevo mensaje enviado, **se vuelve a enviar todo el historial de la conversación** al modelo. Esto aumenta considerablemente el número de **tokens de entrada** y, por tanto, el impacto ambiental.
Además, un historial demasiado largo introduce **ruido** (información innecesaria), lo que reduce la calidad de las respuestas. **Cuanto más limitados y pertinentes sean los tokens de entrada, mejor será la respuesta del chatbot**.

**Ejemplo concreto**:
Si la respuesta del chatbot no tiene en cuenta un elemento importante, **no envíe un nuevo mensaje** pidiéndole que rehaga su respuesta teniendo en cuenta un parámetro adicional.
**Es preferible modificar el mensaje inicial** para integrar esa precisión. Así, la respuesta se regenerará con un contexto más completo, **sin sobrecargar el historial**.

**Caso particular: las pequeñas correcciones**
Si la respuesta es **larga y solo requiere una pequeña modificación**:

- **No modifique el prompt inicial**: se regeneraría una respuesta completa y habría un mayor impacto debido a los tokens de *salida*.
- **Pida al chatbot que corrija únicamente la parte afectada** sin reescribirlo todo.
  *Ejemplo:* *«Corrige únicamente el tercer párrafo, sin copiar de nuevo el resto del texto.»*

Esta buena práctica exige encontrar el **mejor compromiso** entre:

- **Regenerar una respuesta** modificando el mensaje inicial, lo que permite mantener un contexto conciso, pero puede generar más **tokens de salida**;
- **Añadir un mensaje**, lo que permite reducir los **tokens de salida**, pero aumenta la cantidad de **tokens de entrada** con cada nuevo mensaje.

### Conversation engineering: crear ramas

Para mantener un contexto **mínimo y útil**, una técnica eficaz consiste en **crear ramas dentro de una conversación**.
No toda la información intercambiada con el chatbot es necesariamente útil para responder a una nueva petición.

Si pide al chatbot que aclare algún punto de su respuesta, pero su siguiente mensaje **no necesita esa aclaración**, es preferible **modificar la pregunta inicial** en lugar de añadirla a la conversación. Así puede crear **ramas distintas para cada tema** y limitar el contexto a lo estrictamente necesario.

**Ejemplo concreto:**

1. Le hace una pregunta a un chatbot sobre un tema concreto.
2. Responde abordando varios puntos, algunos de los cuales no le quedan claros.
3. Le pide que profundice en el **punto 1**.
4. Para profundizar después en el **punto 2**, **modifica el prompt inicial** para pedirle directamente explicaciones sobre ese punto, en lugar de plantear una nueva pregunta en la conversación.
5. Por último, si quiere pasar a la acción a partir de la respuesta inicial, pídale que **planifique el proyecto modificando el prompt dedicado al punto 2**, en lugar de enviar una nueva pregunta.

En este punto, su conversación cuenta con **3 ramas**:

- La **primera**: su pregunta inicial sobre el tema y una profundización en el **punto 1** que no había entendido.
- La **segunda**: su pregunta inicial sobre el tema y una profundización en el **punto 2** que no había entendido.
- La **tercera**: su pregunta inicial sobre el tema y la petición de planificación.

Cada rama trata, por tanto, un **aspecto específico del proyecto**, lo que permite:

- Conservar una **única conversación** para todo el proyecto.
- Evitar que el contexto se **contamine con información innecesaria**.
- **Ahorrar tokens** enviados al modelo.
- Crear un **método de prompting jerarquizado y especializado**.

![Ejemplo de árbol de ramas de una conversación con un chatbot](images/conv-branching-diagram.png){width=80%}

### Crear una nueva conversación para cada tema nuevo

Hemos comprobado que cada nuevo mensaje enviado provoca el **reenvío íntegro del historial** de la conversación al chatbot. Por tanto, es preferible **iniciar una nueva conversación** cuando se quiere abordar un tema sin relación con el anterior [@Ruf_2025].

Tiene dos opciones:

1. **Crear una nueva conversación** dedicada al nuevo tema.
2. **Modificar el primer mensaje** de la conversación existente para introducir el nuevo tema.

Si elige la segunda opción, **reduce el número de conversaciones** en su historial, lo que permite mantener un **entorno limpio y organizado**.

También puede **reutilizar la respuesta de un chatbot** inyectándola en una **nueva conversación** dedicada a otra tarea, en lugar de continuar en la conversación inicial.
Este enfoque permite, una vez más, **limitar el tamaño del contexto**.

### Eliminar las conversaciones inútiles

Cuando envía un mensaje a un chatbot, incluso antes del historial de sus mensajes, se incluyen varios elementos: el *prompt* del desarrollador, el *prompt* del sistema, información contextual (país, hora, idioma, navegador, etc.), así como un **resumen de cada una de sus conversaciones guardadas** [@mane2026context]. Estos resúmenes añaden un contexto que no siempre es útil para el chatbot. **Elimine sus conversaciones antiguas** cuando ya no le sean útiles.

### Vaciar la memoria a largo plazo

Cuando le pide a un chatbot que recuerde una información durante una conversación, esta se incluirá sistemáticamente en las nuevas conversaciones. Es lo que se conoce como **memoria a largo plazo** [@openai2024memoire]. Para optimizarla, utilice el menú dedicado si existe; si no, cree una conversación específica en la que le pida al chatbot que **liste la información que ha memorizado** y elimine la que ya no sea pertinente.

## Como empresa que desarrolla un agente

### Priorizar los algoritmos y la IA clásica frente a la IA generativa

Cuando sea suficiente, opta por tecnologías menos complejas.
En muchos casos, bastan simples algoritmos de decisión o IA clásicas de predicción o clasificación.

### Utilizar modelos pequeños especializados

Hemos visto antes que el número de parámetros activados de un modelo influye de manera importante en el impacto ambiental del procesamiento de un token.

Dé prioridad al uso de modelos pequeños y especializados. A veces incluso permite obtener resultados más precisos que con grandes modelos generalistas [@cao2026taskspecificefficiencyanalysissmall ; @li2024smalllanguagemodelsapplication]
En Hugging Face hay disponibles modelos ya especializados en una tarea mediante fine-tuning. Es preferible utilizarlos antes que realizar un nuevo fine-tuning.

### Prompt engineering para reducir el número de tokens de salida

Del mismo modo que el usuario puede limitar los tokens de salida, el desarrollador puede precisar explícitamente la forma esperada de la respuesta en el *prompt del sistema*. Este es tenido en cuenta por el modelo incluso antes de la primera consulta del usuario y permite reducir sistemáticamente el número de tokens de salida.

### Context engineering para reducir el número de tokens de entrada

Existen numerosas técnicas para **limitar el contexto** conservando solo la información útil.

**Ejemplos:**
- Tras una conversación de 10 mensajes, se puede recurrir a un modelo pequeño para **resumir los intercambios**. Este resumen puede sustituir al historial en los siguientes intercambios.
- **En un proceso de varias etapas**, los pasos pueden **descomponerse** para proporcionar al modelo **únicamente la información estrictamente necesaria** en cada etapa.

Puede diseñar muchos otros métodos para **limitar el contexto enviado al modelo**.

### Fine-tuning vs Few-shots-ejemplos

Para que un modelo produzca una salida que se ajuste a lo esperado, es posible añadir ejemplos o realizar *fine-tuning*.
Si el agente no se utilizará de manera intensiva*, se recomienda *añadir ejemplos al contexto** (*one-shot* o *few-shots*). En cambio, para un uso masivo, es preferible reducir el número de tokens de entrada recurriendo al *fine-tuning*. Este permite al modelo comprender el tipo de respuesta esperado **sin necesidad de proporcionarle ejemplos en cada consulta**. Sin embargo, el *fine-tuning* tiene un **coste ambiental y económico elevado**.

**Elegir entre *few-shots* y *fine-tuning***
Para determinar el umbral a partir del cual el *fine-tuning* resulta más rentable, puede:
1. Convertir en tokens las instrucciones de la tarea y los *few-shots*.
2. Estimar el coste por consulta en función de ese número de tokens.
3. Comparar el coste acumulado de todas las consultas **con** *few-shots* con el coste de todas las consultas **sin** *few-shots* sumado al coste fijo del *fine-tuning*.

Cuando el coste total de las consultas **sin** *few-shots* sumado al del *fine-tuning* sea inferior al de las consultas **con** *few-shots*, opta por el *fine-tuning*.

### Alojar el modelo en un data center de bajo impacto energético e hídrico

Cuando decida alojar usted mismo su modelo en un proveedor de nube pública, puede seleccionar una región con una **buena puntuación energética e hídrica**: factor de emisión bajo, PUE y WUE bajos durante todo el año. 

#### Punto de vista de las emisiones de carbono
Basándose en los datos proporcionados por Ember Energy, preseleccione un país con un factor de emisión bajo como Islandia, Noruega, Suiza o Francia.

Los principales proveedores de nube indican la ubicación de sus data centers por región:
- Amazon Web Services: [https://aws.amazon.com/fr/about-aws/global-infrastructure/regions_az/](https://aws.amazon.com/fr/about-aws/global-infrastructure/regions_az/)
- Microsoft Azure: [https://learn.microsoft.com/en-us/azure/reliability/regions-list?tabs=all](https://learn.microsoft.com/en-us/azure/reliability/regions-list?tabs=all)
- Google Cloud Platform: [https://datacenters.google/locations/](https://datacenters.google/locations/)
- Salesforce: [https://help.salesforce.com/s/articleView?id=000396845&type=1](https://help.salesforce.com/s/articleView?id=000396845&type=1)
- OVH: [https://www.ovhcloud.com/en/datacenter/](https://www.ovhcloud.com/en/datacenter/)

Una vez preseleccionada la región, tenga en cuenta el PUE del proveedor.
Puede encontrar estos valores por región para los principales proveedores de nube:

- **Amazon Web Services**: [https://sustainability.aboutamazon.com/products-services/aws-cloud](https://sustainability.aboutamazon.com/products-services/aws-cloud)
- **Microsoft Azure**: [https://datacenters.microsoft.com/sustainability/efficiency/](https://datacenters.microsoft.com/sustainability/efficiency/)
- **Google Cloud Platform**: [https://datacenters.google/efficiency/](https://datacenters.google/efficiency/)
- **OVH**: [https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf](https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf)

#### Punto de vista del consumo de agua
Compruebe que la región preseleccionada no corre riesgo de sequía.
Para evaluar los riesgos relacionados con la disponibilidad de agua, el **World Resources Institute (WRI)** ofrece un mapa de las regiones con alto riesgo de sequía: [https://www.wri.org/aqueduct/tools](https://www.wri.org/aqueduct/tools).

Por último, fíjese en el WUE. Cuando falte este indicador, considere el WUE de la región de otro proveedor:

- **Amazon Web Services**: [https://sustainability.aboutamazon.com/products-services/aws-cloud/](https://sustainability.aboutamazon.com/products-services/aws-cloud/) ;
- **Microsoft Azure**: [https://datacenters.microsoft.com/sustainability/efficiency/](https://datacenters.microsoft.com/sustainability/efficiency/) ;
- **Google Cloud Platform**: enlace [https://services.google.com/fh/files/misc/measuring_the_environmental_impact_of_delivering_ai_at_google_scale.pdf](https://services.google.com/fh/files/misc/measuring_the_environmental_impact_of_delivering_ai_at_google_scale.pdf) ;
- **OVH**: [https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf](https://www.ovhcloud.com/sites/default/files/external_files/kpis_fy25.pdf).

### Motor de inferencia

Algunos proveedores optimizan sus modelos para motores de inferencia específicos [@nvidia2026llminference]. El motor adecuado puede indicarse en la ficha de presentación del modelo.

### Utilizar la caché

La funcionalidad de **caché** permite almacenar y reutilizar los cálculos de atención, así como los tokens de un prompt ya procesado, evitando así tener que recalcularlo todo en cada consulta.

**Casos de uso optimizados con la caché**:

- **Repetición de un contexto voluminoso**: por ejemplo, cuando envía con frecuencia la misma documentación en el contexto, o el historial completo de una conversación (caso de un chatbot).
- **Agentes autónomos**: los agentes que realizan llamadas sucesivas apoyándose en el mismo **prompt del sistema** (instrucciones básicas, herramientas disponibles, ejemplos de guía) y en un estado compartido.
- **Asistentes de código**: análisis de un repositorio de código voluminoso e idéntico en cada mensaje.

Para que una caché sea eficaz, las consultas deben estar poco espaciadas en el tiempo y el prefijo del prompt (la parte que se va a almacenar en caché) debe ser **estrictamente idéntico** de una consulta a otra. El más mínimo espacio o carácter modificado al principio del texto invalidará total o parcialmente la caché existente.

### Procesamiento por lotes (Batch processing)

El **batch processing** consiste en enviar un gran número de consultas para que se procesen simultáneamente. Este método optimiza la inferencia del modelo y permite **reducir de manera significativa** el coste energético y económico [@poddar2025sustainablenlpinsightsbenchmarking].

Los proveedores de modelos mediante API suelen ofrecer el *batch processing* a **mitad de precio** respecto al procesamiento clásico. Aunque no existen datos precisos en la literatura que cuantifiquen esta reducción, se puede suponer que la variación del precio está correlacionada con la del impacto energético.

Envíe periódicamente todas las consultas **en batch** si no necesita las respuestas del modelo en **tiempo real**, si el **volumen de consultas es grande** y si son **independientes** entre sí.

### Modelos recientes

**Manténgase informado** sobre los nuevos modelos, ya que algunos pueden ofrecer un rendimiento equivalente al de su modelo actual **con un impacto menor**, gracias a una optimización o una innovación.

![Principales LLM clasificados según sus capacidades, en función del número de parámetros utilizados para su entrenamiento](images/Major-Large-Language-Models.png){width=80%}

*Panorama mundial de los LLM y de su rendimiento [@david2025llm]*

En la generación de imágenes, por ejemplo, un estudio sugiere que la elección del tipo de modelo debería tener en cuenta la longitud prevista de la salida: los modelos autorregresivos (los más utilizados) siguen siendo preferibles para las respuestas cortas (menos de 1024 tokens), mientras que los modelos de difusión ofrecen ventajas indiscutibles para las tareas de generación más largas [@ruf2026diffusion].

Atención: cambiar de modelo puede implicar una nueva fase de desarrollo (evaluación, fine-tuning) con un impacto ambiental significativo.
Además, optimizar una tecnología tiende más bien a aumentar su impacto global, porque se vuelve poco costosa y, por tanto, se utiliza mucho más. Es el efecto rebote [@jevons1865coal].

#### «La quantization»: reducir la precisión de los cálculos reduce las necesidades de energía

«Quantizar» un modelo consiste en reducir la precisión de sus cálculos. Se pasa de números de coma flotante a números enteros. Al reducir la precisión de los cálculos, se puede, en determinadas condiciones, reducir la cantidad de energía consumida por el modelo [@delavande2026understandingefficiencyquantizationbatching; @poddar2025sustainablenlpinsightsbenchmarking].
Por supuesto, esta reducción de decimales conlleva una pérdida de precisión en los cálculos. Pero hoy en día es posible utilizar modelos «quantizados» conservando muy buenos rendimientos.

#### La destilación: cuando el alumno supera al maestro

Una técnica que permite reducir el tamaño de los modelos y, por consiguiente, su impacto durante la ejecución es la destilación del conocimiento.
Esta técnica fue la que se utilizó para crear DeepSeek con una fracción del coste energético de ChatGPT [@young2025deepseek].
Consiste en utilizar un modelo profesor, de muy gran tamaño, para generar datos que servirán después para afinar el entrenamiento de otro modelo, llamado modelo alumno, mucho más pequeño. El modelo alumno puede así adquirir conocimientos similares a los de su profesor, necesitando muchos menos recursos para su ejecución [@jiao-etal-2020-tinybert].

#### Los modelos podados (Pruning)

La poda (*pruning*) consiste en eliminar parámetros del modelo. Esta técnica permite reducir en gran medida el tamaño, y por tanto el coste de ejecución, conservando un buen rendimiento [@ICLR2024_160adf2d].
