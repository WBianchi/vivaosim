export function useMask() {
  // Máscara de telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  const phoneMask = (value: string): string => {
    if (!value) return ''
    const cleaned = value.replace(/\D/g, '')
    
    if (cleaned.length <= 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 14)
    } else {
      // Celular: (XX) XXXXX-XXXX
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15)
    }
  }

  // Máscara de CPF: XXX.XXX.XXX-XX ou CNPJ: XX.XXX.XXX/XXXX-XX
  const documentMask = (value: string): string => {
    if (!value) return ''
    const cleaned = value.replace(/\D/g, '')
    
    if (cleaned.length <= 11) {
      // CPF: XXX.XXX.XXX-XX
      return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1-$2')
        .substring(0, 14)
    } else {
      // CNPJ: XX.XXX.XXX/XXXX-XX
      return cleaned
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18)
    }
  }

  // Máscara de CEP: XXXXX-XXX
  const cepMask = (value: string): string => {
    if (!value) return ''
    const cleaned = value.replace(/\D/g, '')
    
    return cleaned
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9)
  }

  // Remove todas as máscaras (retorna apenas números)
  const removeMask = (value: string): string => {
    return value.replace(/\D/g, '')
  }

  return {
    phoneMask,
    documentMask,
    cepMask,
    removeMask
  }
}
