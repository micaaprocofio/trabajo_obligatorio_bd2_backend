export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
            error: 'Ya existe un registro con estos datos.' 
        });
    }
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            error: 'Error de validación', 
            details: err.message 
        });
    }
    
    res.status(500).json({ 
        error: 'Ocurrió un error en el servidor.', 
        details: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
    });
}; 