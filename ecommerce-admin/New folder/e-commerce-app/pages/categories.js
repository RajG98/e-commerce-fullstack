import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  useEffect(() => {
    fetchCatergories();
  }, [])
  function fetchCatergories(){
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    if (editedCategory) {
      await axios.put('/api/categories', {
        name, parentCategory
        , _id: editedCategory._id,
      })
      setEditedCategory(null);
    } else {
      
      await axios.post('/api/categories', { name,parentCategory });
    }
    setName('');
    fetchCatergories();
  }
  async function deleteCategory(category) {
    // ev.preventDefault();
    const { _id } = category;
    await axios.delete('/api/categories?_id='+_id);
    fetchCatergories();
  }
  
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>{editedCategory ? `Edit Category ${editedCategory.name}` : 'Create new category'}</label>
          <form onSubmit={ saveCategory} className="flex gap-1">
        <input className="mb-0" type="text"
          placeholder={"Category name"}
          onChange={ev=>setName(ev.target.value)}
          value={name} />
        <select className="mb-0" value={parentCategory}
        onChange={ev=> setParentCategory(ev.target.value)}>
          <option value="000000000000000000000000">No parent category</option>
          {categories.length > 0 && categories.map(
            category => (
              <option value={category._id}>{category.name}</option>
             
            )
          )}
        </select>
        <button type={"submit"} className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 && categories.map(
            category => (
              <tr>
                <td>{category.name }</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={()=>editCategory(category)}
                    className="mr-1 btn-primary">Edit</button>
                  <button
                    onClick={(ev) => {
                      // ev.preventDefault();
                      deleteCategory(category)
                    }}
                    className="mr-1 btn-primary">Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </Layout>
  );
}
