# Medir el impacto ambiental de la IA generativa

## Estado del arte

Hoy en día, organismos privados como Meta, Mistral, Google, DeepSeek o Alibaba ponen a disposición modelos de IA de forma open-source u open-weights (descargables, pero cuyo proceso de diseño es confidencial). Por tanto, en teoría es posible medir su huella ambiental con certeza.

Por ejemplo, el ML.ENERGY Leaderboard [@chung2025mlenergybenchmarkautomatedinference] mide directamente el consumo eléctrico de los modelos con su herramienta Zeus [@zeus-nsdi23]. Esta iniciativa incluso es citada por OpenAI [@openai_academy_environmental_impact_ai].

Sin embargo, los modelos más potentes pertenecen hoy a OpenAI, Google y Anthropic. 
Estos modelos propietarios son accesibles principalmente mediante API que impiden la medición directa de la energía por parte de organismos externos.
Google estima que una consulta mediana a Gemini consume 0,24 Wh de energía, emite 0,03 gCO₂e y consume 0,26 mL (unas cinco gotas) de agua. El impacto energético por consulta equivale a ver la televisión durante menos de nueve segundos [@elsworth2025measuringenvironmentalimpactdelivering].
El CEO de OpenAI afirma que una consulta media dirigida a ChatGPT consume aproximadamente 0,34 Wh de energía y 0,3 mL (6 gotas) de agua [@altman2025gentle]. 
Sin embargo, ninguno de los dos proveedores precisa el número exacto de tokens por prompt ni el número de parámetros de los modelos utilizados. Esta falta de transparencia no permite, por tanto, interpretar estos valores con rigor ni comparar el impacto de los modelos.

Algunos actores intentan estimar el impacto ambiental de los modelos cerrados recurriendo a aproximaciones [@Luccioni_2024]. Análisis independientes estiman que una consulta consume entre **0,3 y 29 Wh** [@epoch_gradient_updates ; @jegham2025hungryaibenchmarkingenergy].

Otros actores sin ánimo de lucro han desarrollado métodos de estimación que cubren un amplio perímetro, basados en estimaciones para los modelos cerrados [@Rince2025 ; @sncf_impactia_2026] o en datos reales medidos en modelos abiertos [@huggingface_llm_perf_leaderboard].

Sin embargo, aunque no se cuestione el profesionalismo de estos organismos, estas estimaciones deben interpretarse con cautela, ya que se basan en gran medida en hipótesis difícilmente verificables.
Por ejemplo, un estudio [@DEVRIES20232191] citado 526 veces, entre otros en artículos de revistas científicas serias como Nature [@Xiao2025], se basa en una cita de un miembro de la dirección de Alphabet (Google) sin pruebas que la respalden [@dastin2023focus].

## Herramientas y calculadoras

Para ayudar a intentar medir el impacto ambiental de la IA generativa, se han desarrollado herramientas y calculadoras:

### Mi calculadora del impacto ambiental de su conversación con la IA

Desarrollada especialmente para ilustrar las buenas prácticas compartidas en el próximo capítulo de este artículo, esta calculadora está concebida para ser sencilla de usar y accesible al gran público.
Se basa en un perímetro restringido de la metodología de Ecologits en el que algunos valores hipotéticos se han sustituido por valores medidos. También se han añadido variables adicionales para poner de relieve las palancas que permiten reducir la huella ambiental del usuario.

**Pruébela ahora mismo** copiando y pegando algunos fragmentos de su última conversación con una IA: [https://felixmortas.com/ai-inf-calculator](https://felixmortas.com/ai-inf-calculator)

Esta calculadora, como cualquier método de estimación, presenta limitaciones:

- No tiene en cuenta los tokens de razonamiento invisibles. Una próxima versión podría estimar su proporción respecto al número de tokens de salida visibles, en función del nivel de esfuerzo de razonamiento.
- Los agentes conversacionales probablemente realizan varias pasadas de procesamiento, en particular en bucles. Por tanto, el texto de entrada puede procesarse varias veces. La calculadora no tiene en cuenta estos bucles ni el reprocesamiento de tokens que implican.
- El coste energético de un token de salida depende del número de tokens generados previamente. En la calculadora se supone que todos los tokens de salida tienen el mismo coste energético [@vartziotis2026tokenswatthoursanalyticalenergy].

### Otras buenas herramientas

- Zeus Project por ML.ENERGY: para medir directamente la energía consumida en la máquina [@zeus-nsdi23], y el ML.ENERGY Leaderboard para comparar el consumo energético de los modelos abiertos [@chung2025mlenergybenchmarkautomatedinference].
- Un modelo de datos abiertos e interconectados para construir escenarios de huella de carbono, que mejora la calidad y la transparencia de los datos desde el diseño [@ruf2023openlinkeddatamodel].
- CodeCarbon: una biblioteca de Python para medir en directo el consumo energético de la máquina (ordenador personal o servidor) [@courty2026codecarbon]. Ojo, porque no tiene en cuenta el código ejecutado a través de API.
- EcoLogits por CodeCarbon: una calculadora web y una biblioteca de Python para estimar la huella de carbono de la IA generativa a través de API, utilizando el token como unidad de medida [@ecologits_calculator]. La herramienta crea buenas sinergias con CodeCarbon.
- Impact'IA por la SNCF: una calculadora con un perímetro más amplio que Ecologits, pero con numerosas hipótesis que aumentan considerablemente la incertidumbre [@sncf_impactia_2026].
- LLM Perf Leaderboard por Hugging Face: un comparador del rendimiento de modelos abiertos, que incluye la energía por token generado [@huggingface_llm_perf_leaderboard].
- Otros recursos, como herramientas o artículos, están recopilados en el repositorio de GitHub [@rince_awesome_green_ai] de un miembro de la organización CodeCarbon: [https://github.com/samuelrince/awesome-green-ai](https://github.com/samuelrince/awesome-green-ai)
- A veces es imposible medir directamente el consumo energético de las máquinas. Sin embargo, este está muy ligado al tiempo de ejecución del modelo [@Zschache2026], lo que lo convierte en un parámetro utilizable para medir el impacto ambiental de un LLM alojado.
