const CommonModel = require('../models/commonModel');
const videoController = {};
const Videos = new CommonModel('video');


videoController.index = (req, res) => {
    Videos.getAll((err, results) => {
        if (err) {
            req.flash('error', 'Error fetching videos');
            return res.redirect('/admin/videos');
        }
        res.render('admin/video/index', { data: results, messages: req.flash() });
    });
};


videoController.add = (req, res) => {
    res.render('admin/video/add', { messages: req.flash() });
};


videoController.store = (req, res) => {
    const { v_link, judul, channel, duration, difficulty } = req.body;
    const newVideo = { v_link, judul, channel, duration, difficulty };

    Videos.create(newVideo, (err) => {
        if (err) {
            req.flash('error', 'Failed to add video');
            return res.redirect('/admin/videos/add');
        }
        req.flash('success', 'Video added successfully');
        res.redirect('/admin/videos');
    });
};

// Show edit video form
videoController.edit = (req, res) => {
    const id = req.params.id;
    Videos.getById(id, (err, results) => {
        if (err || results.length === 0) {
            req.flash('error', 'Video not found');
            return res.redirect('/admin/videos');
        }
        res.render('admin/video/edit', { videos: results[0], messages: req.flash() });
    });
};

// Update video
videoController.update = (req, res) => {
    const id = req.params.id;
    const { v_link, judul, channel, duration, difficulty } = req.body;
    const updatedVideo = { v_link, judul, channel, duration, difficulty };

    Videos.update(id, updatedVideo, (err) => {
        if (err) {
            req.flash('error', 'Failed to update video');
            return res.redirect(`/admin/videos/edit/${id}`);
        }
        req.flash('success', 'Video updated successfully');
        res.redirect('/admin/videos');
    });
};

// Delete video
videoController.delete = (req, res) => {
    const id = req.params.id;

    Videos.delete(id, (err) => {
        if (err) {
            req.flash('error', 'Failed to delete video');
            return res.redirect('/admin/videos');
        }
        req.flash('success', 'Video deleted successfully');
        res.redirect('/admin/videos');
    });
};

module.exports = videoController;
