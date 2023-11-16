import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category:existingCategory,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category,setCategory]=useState(existingCategory||'000000000000000000000000')
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [loading, isLoading] = useState(false);
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
      
    })
  },[])
  async function saveProduct(e) {
    e.preventDefault();
    const data = { title, description, price,images,category };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
    }
  async function uploadImages(ev) {
    isLoading(true);
        const files = ev.target?.files;
        if (files?.length > 0) {
          const data = new FormData();
          for (const file of files) {
            data.append('file', file);
          }
          
          const res = await axios.post('/api/upload', data);
          setImages(oldImages => {
            return [...oldImages, ...res.data.links];
          })
    }
    isLoading(false);
    }
  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label >Category</label>
      <select value={category}
      onChange={ev=>setCategory(ev.target.value)}>
        <option value="000000000000000000000000" key="000000000000000000000000">Uncategorized</option>
        {categories.length > 0 && categories.map(
            category => (
              <option value={category._id} key={category._id}>{category.name}</option>
             
            )
          )}
      </select>
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        {!!images?.length && images.map(link => (
          <div key={link} className="h-24">
            <img src={link} alt="" className="rounded-lg"/>
          </div>
        ))}
        {loading && (
          <div className="h-24 flex items-center">
           <Spinner/>
          </div>
        )}
        <label
          className="w-24 h-24 cursor-pointer text-center
        flex items-center justify-center text-sm gap-1 text-gray-500
        rounded-lg bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div> Upload</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
        
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Price (in INR)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
