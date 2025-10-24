/**
 * Valida se um CPF é válido
 */
export function validarCPF(cpf: string): boolean {
	const cleaned = cpf.replace(/\D/g, '');

	if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) {
		return false;
	}

	let sum = 0;
	let remainder;

	for (let i = 1; i <= 9; i++) {
		sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
	}

	remainder = (sum * 10) % 11;
	if (remainder === 10 || remainder === 11) remainder = 0;
	if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

	sum = 0;
	for (let i = 1; i <= 10; i++) {
		sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
	}

	remainder = (sum * 10) % 11;
	if (remainder === 10 || remainder === 11) remainder = 0;
	if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

	return true;
}

/**
 * Valida se um email é válido
 */
export function validarEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Valida se um telefone é válido
 */
export function validarTelefone(telefone: string): boolean {
	const cleaned = telefone.replace(/\D/g, '');
	return cleaned.length === 10 || cleaned.length === 11;
}
