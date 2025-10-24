/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 */
export function formatarData(dataStr: string): string {
	const [ano, mes, dia] = dataStr.split('-');
	return `${dia}/${mes}/${ano}`;
}

/**
 * Formata um valor numérico para moeda brasileira
 */
export function formatarMoeda(valor: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(valor);
}

/**
 * Formata um telefone para o padrão brasileiro
 */
export function formatarTelefone(telefone: string): string {
	const cleaned = telefone.replace(/\D/g, '');

	if (cleaned.length === 11) {
		return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
			7
		)}`;
	}

	if (cleaned.length === 10) {
		return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
			6
		)}`;
	}

	return telefone;
}

/**
 * Formata um CPF para o padrão brasileiro
 */
export function formatarCPF(cpf: string): string {
	const cleaned = cpf.replace(/\D/g, '');

	if (cleaned.length === 11) {
		return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(
			6,
			9
		)}-${cleaned.slice(9)}`;
	}

	return cpf;
}
