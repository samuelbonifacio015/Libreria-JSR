// Script de prueba para verificar extracción de precio
console.log('🧪 Probando extracción de precio...');

const testPrice = "S/. 65.00";
const cleanedText = testPrice.replace(/[^\d.]/g, '');
const extractedPrice = parseFloat(cleanedText);

console.log('Resultados de la prueba:');
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

console.log('\n🧪 Probando múltiples casos:');
testCases.forEach((price, index) => {
    const clean = price.replace(/[^\d.]/g, '');
    const extracted = parseFloat(clean);
    console.log(`${index + 1}. "${price}" -> "${clean}" -> ${extracted}`);
}); 