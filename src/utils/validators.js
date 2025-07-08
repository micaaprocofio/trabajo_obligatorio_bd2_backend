export const validateId = (id) => {
    return id && !isNaN(id) && parseInt(id) > 0;
};

export const validateCI = (ci) => {
    return ci && /^\d{8}$/.test(ci.toString());
};

export const validateCredencialCivica = (credencial) => {
    return credencial && typeof credencial === 'string' && credencial.trim().length > 0;
};

export const validateCiudadanoBusqueda = (req, res, next) => {
    const { credencial } = req.query;
    
    if (!credencial) {
        return res.status(400).json({ 
            error: 'El parámetro "credencial" es requerido.' 
        });
    }
    
    if (!validateCredencialCivica(credencial)) {
        return res.status(400).json({ 
            error: 'La credencial cívica debe ser un texto válido.' 
        });
    }
    
    next();
};

export const validateCiudadanoBusquedaCI = (req, res, next) => {
    const { ci } = req.query;
    
    if (!ci) {
        return res.status(400).json({ 
            error: 'El parámetro "ci" es requerido.' 
        });
    }
    
    if (!validateCI(ci)) {
        return res.status(400).json({ 
            error: 'El CI debe tener exactamente 8 dígitos.' 
        });
    }
    
    next();
};

export const validateRegistroVotante = (req, res, next) => {
    const { ci_ciudadano, id_eleccion, credencial_civica } = req.body;
    
    if (!ci_ciudadano || !id_eleccion || !credencial_civica) {
        return res.status(400).json({ 
            error: 'Los parámetros "ci_ciudadano", "id_eleccion" y "credencial_civica" son requeridos.' 
        });
    }
    
    if (!validateCI(ci_ciudadano)) {
        return res.status(400).json({ 
            error: 'El CI debe tener exactamente 8 dígitos.' 
        });
    }
    
    if (!validateId(id_eleccion)) {
        return res.status(400).json({ 
            error: 'El ID de elección debe ser un número válido.' 
        });
    }
    
    if (!validateCredencialCivica(credencial_civica)) {
        return res.status(400).json({ 
            error: 'La credencial cívica debe ser un texto válido.' 
        });
    }
    
    next();
};

export const validateVoto = (req, res, next) => {
    const { id_eleccion, id_establecimiento, id_lista, voto_en_blanco, voto_anulado } = req.body;
    
    if (!id_eleccion || !id_establecimiento) {
        return res.status(400).json({ 
            error: 'Los parámetros "id_eleccion" y "id_establecimiento" son requeridos.' 
        });
    }
    
    if (!validateId(id_eleccion)) {
        return res.status(400).json({ 
            error: 'El ID de elección debe ser un número válido.' 
        });
    }
    
    if (!validateId(id_establecimiento)) {
        return res.status(400).json({ 
            error: 'El ID de establecimiento debe ser un número válido.' 
        });
    }
    
    const opcionesSeleccionadas = [
        !!id_lista,
        !!voto_en_blanco,
        !!voto_anulado
    ].filter(Boolean).length;

    if (opcionesSeleccionadas !== 1) {
        return res.status(400).json({ 
            error: 'Debe seleccionar exactamente una opción: lista, voto en blanco o voto anulado.' 
        });
    }
    
    if (id_lista !== undefined && !validateId(id_lista)) {
        return res.status(400).json({ 
            error: 'El ID de lista debe ser un número válido.' 
        });
    }
    
    if (voto_en_blanco !== undefined && typeof voto_en_blanco !== 'boolean') {
        return res.status(400).json({ 
            error: 'El parámetro "voto_en_blanco" debe ser un valor booleano.' 
        });
    }
    
    if (voto_anulado !== undefined && typeof voto_anulado !== 'boolean') {
        return res.status(400).json({ 
            error: 'El parámetro "voto_anulado" debe ser un valor booleano.' 
        });
    }
    
    next();
};

export const validateListasBusqueda = (req, res, next) => {
    const { eleccion_id } = req.query;
    
    if (!eleccion_id) {
        return res.status(400).json({ 
            error: 'El parámetro "eleccion_id" es requerido.' 
        });
    }
    
    if (!validateId(eleccion_id)) {
        return res.status(400).json({ 
            error: 'El ID de elección debe ser un número válido.' 
        });
    }
    
    next();
};

export const validateAutoridad = (req, res, next) => {
    const { credencial_civica } = req.body;
    
    if (!credencial_civica) {
        return res.status(400).json({ 
            error: 'El parámetro "credencial_civica" es requerido.' 
        });
    }
    
    if (!validateCredencialCivica(credencial_civica)) {
        return res.status(400).json({ 
            error: 'La credencial cívica debe ser un texto válido.' 
        });
    }
    
    next();
};

export const validatePolitico = (req, res, next) => {
    const { ci_ciudadano } = req.body;
    
    if (!ci_ciudadano) {
        return res.status(400).json({ 
            error: 'El parámetro "ci_ciudadano" es requerido.' 
        });
    }

    if (!validateCI(ci_ciudadano)) {
        return res.status(400).json({
            error: 'El CI debe tener exactamente 8 dígitos.'
        });
    }
    
    next();
};

export const validateAsignacionLista = (req, res, next) => {
    const { id_lista, id_politico, rol } = req.body;
    
    if (!id_lista || !id_politico) {
        return res.status(400).json({ 
            error: 'Los parámetros "id_lista" e "id_politico" son requeridos.' 
        });
    }

    if (!validateId(id_lista)) {
        return res.status(400).json({ 
            error: 'El ID de lista debe ser un número válido.' 
        });
    }
    
    if (!validateId(id_politico)) {
        return res.status(400).json({ 
            error: 'El ID de político debe ser un número válido.' 
        });
    }

    // El rol es opcional, pero si se proporciona, debe ser válido
    if (rol && typeof rol !== 'string') {
        return res.status(400).json({
            error: 'El rol debe ser un texto válido.'
        });
    }
    
    next();
};

export const validateIdParam = (req, res, next) => {
    const { id } = req.params;
    
    if (!validateId(id)) {
        return res.status(400).json({ 
            error: 'El ID debe ser un número válido mayor a 0.' 
        });
    }
    
    next();
};

export const validateCIParam = (req, res, next) => {
    const { ci } = req.params;
    
    if (!validateCI(ci)) {
        return res.status(400).json({ 
            error: 'El CI debe tener exactamente 8 dígitos.' 
        });
    }
    
    next();
}; 