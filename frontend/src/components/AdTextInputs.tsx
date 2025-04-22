export default function AdTextInputs(){
    return(
        <>
            <label htmlFor="titleIn">Title</label>
            <input name="title" id="titleIn" type="text" placeholder="Title"/>

            <label htmlFor="priceIn">Price</label>
            <input name="price" id="princeIn" type="number" placeholder="Price"/>

            <label htmlFor="categoryIn">Category</label>
            <select name="category" id="categoryIn">
                <option value="DEFAULT" disabled>Select a category</option>
                <option value="textbooks">📒 Textbooks</option>
                <option value="furniture">🛋️ Furniture</option>
                <option value="electronics">💻 Electronics</option>
            </select>

            <label htmlFor="descriptionIn">Description</label>
            <textarea name="description" id="descriptionsIn" placeholder="Description">
            </textarea>

            <label htmlFor="phoneIn">Contact information</label>
            <textarea name="contact" id="phoneIn" placeholder="Phone number: +81 80 1234 1234">
            </textarea>

        </>
    );
}