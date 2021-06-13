const quotes = document.querySelectorAll('.quotes')
const buttons = document.querySelectorAll('button')

Array.from(quotes).map(item => {
    item.addEventListener('blur', (e) => {
        console.log('value', e.target.value)
        console.log('_id', e.target.getAttribute('data-id'))
        fetch('/quotes', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quote: e.target.value,
                id: e.target.getAttribute('data-id')
            })
        }).then(result => {
            if (result.ok) result.json()
        }).then(() => window.location.reload())
    })
})

Array.from(buttons).map(item => {
    item.addEventListener('click', (e) => {
        console.log('value', e.target.value)
        console.log('_id', e.target.getAttribute('data-id'))
        fetch('/quotes', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: e.target.getAttribute('data-id')
            })
        }).then(result => {
            if (result.ok) result.json()
        }).then(() => window.location.reload())
    })
})