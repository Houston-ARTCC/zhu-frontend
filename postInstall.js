const replace = require('replace-in-file')

const fixReactSpringPackages = async () => {
    try {
        const results = await replace({
            files: 'node_modules/@react-spring/*/package.json',
            from: '"sideEffects": false',
            to: '"sideEffects": true',
        })

        console.log(results)
    } catch (e) {
        console.log('Error while trying to remove string "sideEffects:false" from react-spring packages', e)
    }

}

fixReactSpringPackages()
