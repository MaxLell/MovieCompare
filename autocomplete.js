/**
 * This function receives a lot of callback functions that 
 * it calls in the process of generating the autocomplete 
 * widget. In addition to this it also receives some data.
 * 
 * This is not a well thought through function - it needs 
 * some heavy refactoring. It does too many things at once.
 * It touches too much code.
 */
const createAutoComplete = (
    {
        root,
        renderOption: renderOptionCallback,
        onOptionSelect: onOptionSelectCallback,
        inputValue,
        fetchData: fetchDataCallback
    }) => {
    /**
     * Generate the base-html code for the autocomplete
     * widget
     */
    root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input">
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
        </div>
    </div>`;

    /**
     * take the position that was passed in (the root argument). 
     * This is the origin position of where the widget is to be
     * placed
     */
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    /**
     * This is the function, which is to executed, when the text
     * input is completed
     */
    const onInput = async (event) => {
        resultsWrapper.innerHTML = '';
        const items = await fetchDataCallback(event.target.value);

        /**
         * Make sure that the return argument actually contains
         * some data. If not, disable the widget and display 
         * nothing
         */
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        /**
         * Enable the widget's dropdown menu
         */
        dropdown.classList.add('is-active');
        for (let item of items) {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerHTML = renderOptionCallback(item);
            /**
             * When the user clicks outside of the dropdown menu, 
             * the menu is disabled
             */
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelectCallback(item);
            });
            resultsWrapper.appendChild(option);
        }
    };

    /**
     * the inputCallback function is debounced: Meaning this
     * callback function is not triggered on every single key-
     * stroke, but rather then that it is only triggered, when
     * no new key was pressed since 500ms
     */
    const inputCallback = debounce(onInput, 500);
    input.addEventListener('input', inputCallback);
    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });
}