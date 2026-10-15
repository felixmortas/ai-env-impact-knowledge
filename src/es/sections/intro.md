Se oye a menudo que una consulta a ChatGPT consume seis veces más electricidad que una búsqueda en Google, y que hace falta aproximadamente medio litro de agua para generar entre 10 y 50 respuestas [@enault2025impactIA].

¿Pero reflejan realmente estas cifras la realidad?

**¡No tan rápido!** Detrás de estas afirmaciones se esconden aproximaciones y atajos metodológicos que merecen examinarse más de cerca.

La [calculadora diseñada para ilustrar este artículo](https://felixmortas.com/ai-inf-calculator) estima que este simple mensaje enviado a DeepSeek emitió 0,28 g de CO₂ equivalente (gCO₂e) y consumió 0,06 mL de agua. Equivale a una bombilla encendida durante 6 minutos y a 1 gota de agua.

![Conversación simple con DeepSeek](images/small-prompt.png){width=60%}

Sin embargo, [la calculadora](https://felixmortas.com/ai-inf-calculator) estima que este intercambio mucho más complejo con Claude emitió 7,48 gCO₂e y consumió 2 mL de agua. Equivale a una bombilla encendida durante 3 horas y 53 minutos, y a 40 gotas de agua.

![Conversación más compleja con Claude](images/big-prompt.png){width=60%}

*Las estimaciones tienen en cuenta el texto visible del chatbot, la electricidad utilizada para hacer funcionar la IA y el agua para refrigerar el data center. No tienen en cuenta el razonamiento de la IA, los bucles de acción, el entrenamiento del modelo, la fabricación del hardware informático y del data center, el uso de la red ni el agua consumida para producir la electricidad. Por tanto, el impacto ambiental global está claramente subestimado.*

**¿Pero cómo se explica una diferencia semejante?**

En este artículo vamos a descifrar lo que se esconde detrás de estas cifras y a comprender qué hace variar realmente la huella ambiental de nuestras conversaciones con la IA. También se verá que adoptar buenas prácticas ambientales conduce, por lo general, a un uso más eficiente.

# Introducción

En un contexto de cambio climático vinculado a las actividades humanas [@IPCC2021SPM], hasta el papa se preocupa por los riesgos que genera la IA [@leoXIV2026MagnificaHumanitas].

El informe «Energy and AI» publicado por la IEA en abril de 2025 prevé que la demanda mundial de energía de los centros de datos se duplicará y pasará a unos 945 TWh de aquí a 2030 —un nivel comparable al consumo anual de electricidad de Japón— y que debería alcanzar unos 1200 TWh de aquí a 2035 [@iea2025energy].
Las Naciones Unidas han publicado recientemente un informe sobre el impacto ambiental de la IA en términos de emisiones de carbono y consumo de agua [@aczel2026environmental].

Tanto las organizaciones como los particulares deben controlar su huella ambiental. Son necesarios consejos concretos y reales para reducir este impacto, tanto a nivel de usuarios como de desarrolladores. Pero para actuar de manera eficaz, primero hay que comprender algunos aspectos del funcionamiento de la IA.

Realicé trabajos de investigación sobre el impacto ambiental de la IA generativa durante 18 meses en AXA, lo que me permitió acumular numerosos conocimientos sobre el tema que hoy quiero compartir.

A lo largo de este artículo, [comprenderá](#understand) cuáles son los factores que más influyen en el impacto ambiental de la IA, cómo [medirlo](#measure) cuando es posible y cómo [reducirlo](#reduce) como usuario final y como desarrollador.

También descubrirá [esta calculadora](https://felixmortas.com/ai-inf-calculator/), que permite medir el impacto de una de sus conversaciones con un chatbot (ChatGPT, Claude, Gemini, pero también Mistral, DeepSeek, etc.). Además, podrá simular la aplicación de ciertas buenas prácticas a esa misma conversación y así comprobar su pertinencia.

*Esta calculadora **no tiene como objetivo** competir con los métodos de estimación existentes ni proporcionar una medida exacta. Su objetivo es ilustrar la eficacia de las buenas prácticas presentadas en este artículo.*
