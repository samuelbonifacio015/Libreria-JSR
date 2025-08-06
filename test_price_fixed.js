// Script de prueba con la corrección aplicada
console.log('🧪 Probando extracción de precio CORREGIDA...');

const testPrice = "S/. 65.00";
const cleanedText = testPrice.replace(/[^\d.]/g, '').replace(/^\./, '');
const extractedPrice = parseFloat(cleanedText);

console.log('Resultados de la prueba CORREGIDA:');
console.log('- Precio original:', testPrice);
console.log('- Texto limpio:', cleanedText);
console.log('- Precio extraído:', extractedPrice);
console.log('- Tipo de dato:', typeof extractedPrice);

// Probar con diferentes formatos
const testCases = [
    "S/. 65.00",
    "S/. 72.00", 
    "S/. 102.00",
    "S/. 55.00"
];

console.log('\n🧪 Probando múltiples casos CORREGIDOS:');
testCases.forEach((price, index) => {
    const clean = price.replace(/[^\d.]/g, '').replace(/^\./, '');
    const extracted = parseFloat(clean);
    console.log(`${index + 1}. "${price}" -> "${clean}" -> ${extracted}`);
}); 