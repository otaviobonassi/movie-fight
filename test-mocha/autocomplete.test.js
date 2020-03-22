const waitFor = (element) => {
    return new Promise( (resolve, reject) => {
        const interval = setInterval( () => {
            if(document.querySelector(element)) {
                resolve();
            }
        }, 30);
        const timeOut = setTimeout ( ()=> {
            clearInterval(interval);
            reject();
        }, 2000);
    })
};

beforeEach( () => {
    document.querySelector("#target").innerHTML = '';
    createAutoComplete({
        root: document.querySelector("#target"),
        fetchData() { 
            return [
                { Title: "avengers"},
                { Title: "not avengers"},
                { Title: "some other movie"},
            ]
        },
        renderOption (movie) {
            return movie.Title;
        }
    });
});

it("Dropdown starts closed", () => {
    const dropdown = document.querySelector(".dropdown");
    expect(dropdown.className).not.to.include("is-active");

});

it('After searching, dropdown opens up', async () => {

    const input = document.querySelector(".input")
    input.value = "Avengers";
    input.dispatchEvent(new Event('input'));//Modo "fake" de disparar um evento

    await waitFor(".dropdown-item"); // O teste precisa esperar até o resultado aparecer para ver se o dropdown funcionou
    const dropdown = document.querySelector(".dropdown");
    expect(dropdown.className).to.include("is-active");
});

it('After searching, exhibit some results', async () => {

    const input = document.querySelector(".input")
    input.value = "Avengers";
    input.dispatchEvent(new Event('input'));//Modo "fake" de disparar um evento

    await waitFor(".dropdown-item"); // O teste precisa esperar até o resultado aparecer para ver se o dropdown funcionou
    const dropdown = document.querySelectorAll(".dropdown-item");
    expect(dropdown.length).to.equal(3);
});