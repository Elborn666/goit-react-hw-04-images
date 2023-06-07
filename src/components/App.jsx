import Searchbar from "./Searchbar/Searchbar";
import ImageGallery from "./ImageGallery/ImageGallery";
import Loader from "./Loader/Loader"
import Button from "./Button/Button";
import Modal from "./Modal/Modal";
import css from "./App.module.css";
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getImages } from 'services/getImages';
import { useState, useEffect } from 'react';


function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [totalHits, setTotalHits] = useState(0);

  //==============================================================================================================
  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    async function fetchGalleryItems(searchQuery, page) {
      setIsLoading(false);
      setError(false);

      const  responseImages = await getImages(searchQuery, page);

      const newData =  responseImages.hits.map(
        ({ id, tags, webformatURL, largeImageURL }) => ({
          id,
          tags,
          webformatURL,
          largeImageURL,
        })
      );
  
      setImages(prevImage => [...prevImage, ...newData]);
      setTotalHits(responseImages.totalHits);

      if (!responseImages.hits.length) {
        setIsLoading(false)
        setError(true)
        return toast.warn(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    };

    fetchGalleryItems(searchQuery, page)
  },[page, searchQuery])

  //==================================================================================================================
  const handleSubmit = newQuery => {
    if (searchQuery === newQuery) {
      return;
    }
    setSearchQuery(newQuery);
    setPage(1);
    setTotalHits(1);
    setImages([]);
    setError(null);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  const onLoadMore = () => {
    setPage(prevPage => prevPage + 1)
  };

  return (
    <div className={css.App}>
      <ToastContainer transition={Flip} />
      <Searchbar onSubmit={handleSubmit} />

      {error && <p>Error: {error}</p>}

      <ImageGallery images={images} onItemClick={handleImageClick} />

      {isLoading && <Loader />}


      {0 < images.length && images.length < totalHits && (
        <Button onClick={onLoadMore} />
      )}
-
      {showModal && (
        <Modal image={selectedImage} onClose={handleModalClose} />
      )}
    </div>
  )
};


export default App