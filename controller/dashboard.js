const dashboard = async (req, res, next) => {
    try {
        res.render('pages/dashboard', {
            title: 'Dashboard'
        })
    } catch (error) {
        console.log("🚀 ~ dashboard ~ error:", error)
    }
}

module.exports = {
    dashboard
}