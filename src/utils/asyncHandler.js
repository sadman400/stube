const asyncHandler = (fn) => async (req, res, next) => {
    try {
        
        const func = await fn(req, res, next)
        return func;

    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

export {asyncHandler};