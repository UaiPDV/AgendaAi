import { useState } from 'react';

/**
 * Hook para gerenciar formulários
 */
export function useForm<T>(initialState: T) {
	const [formData, setFormData] = useState<T>(initialState);
	const [loading, setLoading] = useState(false);

	const updateField = (field: keyof T, value: T[keyof T]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const updateForm = (data: Partial<T>) => {
		setFormData((prev) => ({ ...prev, ...data }));
	};

	const resetForm = () => {
		setFormData(initialState);
	};

	return {
		formData,
		setFormData,
		updateField,
		updateForm,
		resetForm,
		loading,
		setLoading,
	};
}
