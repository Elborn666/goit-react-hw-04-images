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
  const [isLastPage, setIsLastPage] = useState(false);
  // const [isButtonShow, setIsButtonShow] = useState(false);

  //==============================================================================================================
  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    async function fetchGalleryItems(searchQuery, page) {
      setIsLoading(true);
      setError(false);
      const { hits, totalHits } = await getImages(searchQuery, page);
  
      const newData = hits.map(
        ({ id, tags, webformatURL, largeImageURL }) => ({
          id,
          tags,
          webformatURL,
          largeImageURL,
        })
      );
      const currentData = [...images, ...newData];
  
      setImages(prevImage => [...prevImage, ...newData])
  
      if (!totalHits) {
        setIsLoading(false)
        setError(true)
        return toast.warn(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (currentData.length >= totalHits) {
        setIsLoading(false);
        setIsLastPage(false);
        setError(false);
  
        return;
      }
  
      if (currentData.length <= totalHits) {
        setIsLoading(false);
        setIsLastPage(true);
        setError(false);
  
        return;
      }
    };

    fetchGalleryItems()
  },[page, searchQuery, images])


  // if (nextPage === 1) {
  //   fetchGalleryItems(newQuery, nextPage);
  // } else if (page !== nextPage) {
  // fetchGalleryItems(newQuery, nextPage);
  // }

  //==================================================================================================================
  const handleSubmit = newQuery => {
    if (searchQuery === newQuery) {
      return;
    }
    setSearchQuery(newQuery);
    setPage(1);
    setImages([]);
    setError(null);
    setIsLastPage(false)
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


      {!isLoading && images.length > 0 && !isLastPage && (
        <Button onClick={onLoadMore} />
      )}

      {showModal && (
        <Modal image={selectedImage} onClose={handleModalClose} />
      )}
    </div>
  )
};


export default App