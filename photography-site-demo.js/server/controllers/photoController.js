const Category = require('../models/Category');
const Photo = require('../models/Photo');
const PhotoEmbedding = require('../models/PhotoEmbedding');
const connect = require('../models/connect');
const getTextEmbedding = require('../utils/textEmbeddingGenerator')
const getPhotoEmbedding = require('../utils/imageEmbeddingGenerator')
const fs = require('fs');




/**
 * POST /searchByPhotoDescriptionByVSearch
 * searchByPhotoDescriptionByVSearch
 * based on the embedding vector of photo description
*/
exports.searchByPhotoDescriptionByVSearch = async (req, res) => {
  await connect();
  let searchTerm = req.body.searchTerm;
  const description_embedding = await getTextEmbedding(searchTerm);
  let photo = null;
  try {
    if (req.body.categoryFilter) {
      photo = await Photo.find({ 'category': { '$eq': req.body.categoryFilter } }).sort({ $vector: { $meta: description_embedding } }).limit(2);
    } else {
      photo = await Photo.find({}).sort({ $vector: { $meta: description_embedding } }).limit(2);
    }
    res.render('similaritySearch', { title: 'photography site - SimilaritySearch', photo, searchTerm });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * POST /searchByPhotoByVSearch
 * searchByPhotoByVSearch
 * based on the embedding vector of photo itself
*/
exports.searchByPhotoByVSearch = async (req, res) => {
  await connect();
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name; //avoid duplication
      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
      imageUploadFile.mv(uploadPath, async function (err) {
        const vector = await getPhotoEmbedding(newImageName); 
        let photo = await PhotoEmbedding.find({}).sort({ $vector: { $meta: vector } }).limit(3);
        fs.unlink(uploadPath, (err) => {
          if (err) {
            console.error('Error deleting the file:', err);
          } else {
            console.log('File deleted successfully');
          }
        });
        res.render('photoSimilaritySearch', { title: 'photography site - similaritySearch ', photo });
      })
    }
  } catch (error) {
    req.flash('infoErrors', error);
    res.redirect('/');
  }
}




/**
 * POST /add-photo
*/
exports.addPhotoOnPost = async (req, res) => {
  await connect();
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name; //avoid duplication
      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })
    }
    const description_embedding1 = await getTextEmbedding(req.body.description);
    const newPhoto = new Photo({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      image: newImageName,
      "$vector": description_embedding1,
    });
    await newPhoto.save();
    const photoEmbedding = await getPhotoEmbedding(newImageName);
    const newPhotoEmbedding = new PhotoEmbedding({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      image: newImageName,
      "$vector": photoEmbedding,
    });
    await newPhotoEmbedding.save();
    req.flash('infoSubmit', 'photo has been added.')
    res.redirect('/add-photo');
  } catch (error) {
    req.flash('infoErrors', error);
    res.redirect('/add-photo');
  }
}

/**
 * GET /
 * Homepage 
*/
exports.homepage = async (req, res) => {
  await connect();
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const animals = await Photo.find({ 'category': 'animal' }).limit(limitNumber);
    const streets = await Photo.find({ 'category': 'street' }).limit(limitNumber);
    const landscapes = await Photo.find({ 'category': 'landscape' }).limit(limitNumber);
    const photos = { animals, streets, landscapes }
    res.render('home', { title: 'photography site - Home', categories, photos });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET /
 * contactPage 
*/
exports.contactPage = async (req, res) => {
  try {
    res.render('contact', { title: 'photography site - Contact' });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async (req, res) => {
  await connect();
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'photography site - Categories', categories });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET /categories/:id
 * Categories By Id -> id in cassandra
*/
exports.exploreCategoriesByName = async (req, res) => {
  await connect();
  try {
    let categoryName = req.params.name;
    const limitNumber = 20;
    const photosOfCategory = await Photo.find({ 'category': categoryName }).limit(limitNumber);
    res.render('categories', { title: 'photography site  - photos in category', photosOfCategory, categoryName });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET /photo/:id
*/
exports.explorePhoto = async (req, res) => {
  await connect();
  try {
    let photoId = req.params.id;
    const photo = await Photo.findById(photoId);
    res.render('photo', { title: 'photography site - Photo', photo });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


exports.explorePhotoEmbedding = async (req, res) => {
  await connect();
  try {
    let photoEmbeddingId = req.params.id;
    const photo = await PhotoEmbedding.findById(photoEmbeddingId);
    res.render('photo', { title: 'photography site - Photo', photo });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * POST /searchByPhotoNameExact
 * SearchByPhotoNameExact 
*/
exports.searchPhotoByNameExact = async (req, res) => {
  await connect();
  try {
    let searchTerm = req.body.searchTerm;
    let photo = await Photo.find({ 'name': { '$eq': searchTerm } });
    res.render('search', { title: 'photography site - Search', photo, searchTerm });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async (req, res) => {
  await connect();
  try {
    const limitNumber = 20;
    const photo = await Photo.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'photography site - Explore Latest', photo });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET /explore-random
*/
exports.exploreRandom = async (req, res) => {
  await connect();
  try {
    let count = await Photo.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let photo = await Photo.findOne().skip(random).exec();
    res.render('explore-random', { title: 'photography site - Explore random', photo });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET /add-photo
*/
exports.addPhoto = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('add-photo', { title: 'photography site - Add Photo', infoErrorsObj, infoSubmitObj });
}



