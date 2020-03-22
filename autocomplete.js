const createAutoComplete = ({
    root, 
    onOptionSelect, 
    renderOption, 
    inputValue, 
    fetchData
}) => {

    //Creates the basic structure of our page
    root.innerHTML = `
        <label><b>Search for a movie</b></label>
        <input class="input">
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results">
                </div>
            </div>
        </div>
    `;


    // Auto-Complete + Searching method
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = debounce(async event => {
        const items = await fetchData(event.target.value);

        if(!items.length){ //Caso não encontre resultado ou a busca seja nula, remove o dropdown
            dropdown.classList.remove("is-active");
            return;
        };

        resultsWrapper.innerHTML = "";
        dropdown.classList.add('is-active'); //is-active é a classe do Bulma que faz o dropdown ser aberto

        for (let item of items) {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            
            option.innerHTML = renderOption(item);

            option.addEventListener('click', async () => {
                input.value = inputValue(item);
                dropdown.classList.remove("is-active");
                onOptionSelect(item);
                
            });

            resultsWrapper.appendChild(option);

        };
    });

    input.addEventListener('input', onInput);
    document.addEventListener('click', event => {
        if(!root.contains(event.target)){
            dropdown.classList.remove("is-active");
        };
    });
};