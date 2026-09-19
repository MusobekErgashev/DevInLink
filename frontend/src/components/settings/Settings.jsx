'use client'

import { ChevronDown, Plus, Send, Trash, FolderKanban, Trophy, Upload, User, Code, Briefcase, GraduationCap, X, Loader2, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';

export default function Settings() {
    // Accordion visibility states
    const [openAccount, setOpenAccount] = useState(true);
    const [openTechnologies, setOpenTechnologies] = useState(false);
    const [openExpEdu, setOpenExpEdu] = useState(false);
    const [openPortfolio, setOpenPortfolio] = useState(false);
    const [openAwards, setOpenAwards] = useState(false);

    // User Account State
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [experienceYears, setExperienceYears] = useState("");
    const [age, setAge] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [avatar, setAvatar] = useState("");
    const [location, setLocation] = useState("");
    const [headline, setHeadline] = useState("");
    const [about, setAbout] = useState("");
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [telegram, setTelegram] = useState("");
    const [instagram, setInstagram] = useState("");
    const [youtube, setYoutube] = useState("");
    const [website, setWebsite] = useState("");
    const [phone, setPhone] = useState("");
    const [leetcodeUsername, setLeetcodeUsername] = useState("");

    // Technologies State
    const [technologies, setTechnologies] = useState([]);
    const [newTech, setNewTech] = useState("");
    const [technologySummary, setTechnologySummary] = useState("");
    const [editingTechId, setEditingTechId] = useState(null);
    const [editingTechName, setEditingTechName] = useState("");

    // Experience State
    const [experiences, setExperiences] = useState([]);
    const [expCompanyName, setExpCompanyName] = useState("");
    const [expPosition, setExpPosition] = useState("");
    const [expLocation, setExpLocation] = useState("");
    const [expDescription, setExpDescription] = useState("");
    const [expStartDate, setExpStartDate] = useState("");
    const [expEndDate, setExpEndDate] = useState("");
    const [editingExpId, setEditingExpId] = useState(null);

    // Education State
    const [educations, setEducations] = useState([]);
    const [eduPlace, setEduPlace] = useState("");
    const [eduDegree, setEduDegree] = useState("");
    const [eduLocation, setEduLocation] = useState("");
    const [eduDescription, setEduDescription] = useState("");
    const [eduStartDate, setEduStartDate] = useState("");
    const [eduEndDate, setEduEndDate] = useState("");
    const [eduCourseName, setEduCourseName] = useState("");
    const [editingEduId, setEditingEduId] = useState(null);

    // Portfolio State
    const [portfolios, setPortfolios] = useState([]);
    const [portTitle, setPortTitle] = useState("");
    const [portDescription, setPortDescription] = useState("");
    const [portDemoUrl, setPortDemoUrl] = useState("");
    const [portGithubUrl, setPortGithubUrl] = useState("");
    const [portTechnologies, setPortTechnologies] = useState("");
    const [portHint, setPortHint] = useState("");
    const [portCoverFile, setPortCoverFile] = useState(null);
    const [portCoverPreview, setPortCoverPreview] = useState("");
    const [addingPort, setAddingPort] = useState(false);
    const [editingPortId, setEditingPortId] = useState(null);

    // Awards / Certificates State
    const [awards, setAwards] = useState([]);
    const [awardTitle, setAwardTitle] = useState("");
    const [awardDescription, setAwardDescription] = useState("");
    const [awardDate, setAwardDate] = useState("");
    const [awardImageFile, setAwardImageFile] = useState(null);
    const [awardImagePreview, setAwardImagePreview] = useState("");
    const [addingAward, setAddingAward] = useState(false);
    const [editingAwardId, setEditingAwardId] = useState(null);

    const fetchUserPortfolio = async (uname) => {
        try {
            const res = await api.get(`portfolio/${uname}`);
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setPortfolios(data);
        } catch (err) {
            console.error("Error fetching portfolio:", err);
        }
    };

    const fetchUserAwards = async (uname) => {
        try {
            const res = await api.get(`awards/${encodeURIComponent(uname)}?page=1&limit=100`);
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setAwards(data);
        } catch (err) {
            console.error("Error fetching awards:", err);
        }
    };

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const res = await api.get("users/me");
            const userData = Array.isArray(res.data) ? res.data[0] : res.data;

            if (userData) {
                setUsername(userData.username || "");
                setFirstName(userData.first_name || "");
                setLastName(userData.last_name || "");
                setEmail(userData.email || "");
                setExperienceYears(userData.total_experience_years ?? userData.experience_years ?? "");
                setAge(userData.age || "");
                setJobTitle(userData.job_title || "");
                setAvatar(userData.avatar || "");
                setLocation(userData.location || "");
                setHeadline(userData.headline || "");
                setAbout(userData.about || "");
                setGithub(userData.github_username || "");
                setLinkedin(userData.linkedin_url || "");
                setTelegram(userData.telegram_username || "");
                setInstagram(userData.instagram_url || "");
                setYoutube(userData.youtube_url || "");
                setWebsite(userData.website_url || "");
                setPhone(userData.phone || "");
                setLeetcodeUsername(userData.leetcode_username || "");
                setTechnologySummary(userData.technology_summary || "");

                if (Array.isArray(userData.technologies)) {
                    setTechnologies(userData.technologies);
                }
                if (Array.isArray(userData.experience)) {
                    setExperiences(userData.experience);
                }
                if (Array.isArray(userData.education)) {
                    setEducations(userData.education);
                }

                if (userData.username) {
                    fetchUserPortfolio(userData.username);
                    fetchUserAwards(userData.username);
                }
            }
        } catch (err) {
            console.error("Error fetching user settings:", err);
            toast.error(err.response?.data?.message || "Foydalanuvchi ma'lumotlarini yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Account update submit
    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        try {
            setUpdating(true);
            const payload = {
                first_name: firstName,
                last_name: lastName,
                username: username,
                phone: phone,
                linkedin_url: linkedin,
                instagram_url: instagram,
                youtube_url: youtube,
                website_url: website,
                telegram_username: telegram,
                github_username: github,
                about: about,
                age: age ? parseInt(age) : null,
                technology_summary: technologySummary,
                location: location,
                job_title: jobTitle,
                total_experience_years: (experienceYears !== "" && experienceYears !== null && experienceYears !== undefined) ? parseFloat(experienceYears) : null,
                headline: headline,
                leetcode_username: leetcodeUsername
            };

            const res = await api.put("users/me", payload);
            if (res.status === 200) {
                toast.success("Sozlamalar muvaffaqiyatli saqlandi!");
            }
        } catch (err) {
            console.error("Update settings error:", err);
            toast.error(err.response?.data?.message || "Sozlamalarni saqlashda xatolik yuz berdi");
        } finally {
            setUpdating(false);
        }
    };

    // Avatar upload handler
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setAvatarUploading(true);
            const res = await api.patch("users/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data?.avatar) {
                setAvatar(res.data.avatar);
                toast.success("Avatar muvaffaqiyatli yangilandi!");
            }
        } catch (err) {
            console.error("Avatar upload error:", err);
            toast.error(err.response?.data?.message || "Avatar yuklashda xatolik yuz berdi");
        } finally {
            setAvatarUploading(false);
        }
    };

    // Technologies Handlers
    const handleAddTechnology = async () => {
        if (!newTech.trim()) return;
        try {
            const res = await api.post("technologies", { name: newTech.trim() });
            if (res.status === 201) {
                setTechnologies(prev => [...prev, res.data]);
                setNewTech("");
                toast.success("Texnologiya qo'shildi!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Texnologiya qo'shishda xatolik");
        }
    };

    const handleEditTechnology = (tech) => {
        setEditingTechId(tech.id);
        setEditingTechName(tech.name);
    };

    const handleUpdateTechnology = async () => {
        if (!editingTechName.trim()) return;
        try {
            const res = await api.put(`technologies/${editingTechId}`, { name: editingTechName.trim() });
            setTechnologies(prev => prev.map(t => t.id === editingTechId ? { ...t, name: editingTechName.trim() } : t));
            setEditingTechId(null);
            setEditingTechName("");
            toast.success("Texnologiya yangilandi!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Texnologiyani yangilashda xatolik");
        }
    };

    const handleDeleteTechnology = async (id) => {
        try {
            await api.delete(`technologies/${id}`);
            setTechnologies(prev => prev.filter(item => item.id !== id));
            toast.success("Texnologiya o'chirildi");
        } catch (err) {
            toast.error(err.response?.data?.message || "O'chirishda xatolik");
        }
    };

    // Experience Handlers
    const resetExpForm = () => {
        setExpCompanyName("");
        setExpPosition("");
        setExpLocation("");
        setExpDescription("");
        setExpStartDate("");
        setExpEndDate("");
        setEditingExpId(null);
    };

    const handleEditExperience = (item) => {
        setEditingExpId(item.id);
        setExpCompanyName(item.company_name || "");
        setExpPosition(item.position || "");
        setExpLocation(item.location || "");
        setExpDescription(item.description || "");
        setExpStartDate(item.start_date ? item.start_date.slice(0, 10) : "");
        setExpEndDate(item.end_date ? item.end_date.slice(0, 10) : "");
    };

    const handleAddExperience = async (e) => {
        if (e) e.preventDefault();
        if (!expCompanyName || !expPosition || !expLocation || !expStartDate) {
            toast.error("Kompaniya nomi, lavozim, joylashuv va boshlanish sanasi kiritilishi shart!");
            return;
        }
        if (editingExpId) {
            // UPDATE mode
            try {
                const res = await api.put(`experience/${editingExpId}`, {
                    company_name: expCompanyName,
                    position: expPosition,
                    location: expLocation,
                    description: expDescription,
                    start_date: expStartDate,
                    end_date: expEndDate || null
                });
                setExperiences(prev => prev.map(item => item.id === editingExpId ? { ...item, ...res.data } : item));
                resetExpForm();
                toast.success("Tajriba yangilandi!");
            } catch (err) {
                toast.error(err.response?.data?.message || "Tajribani yangilashda xatolik");
            }
            return;
        }
        try {
            const res = await api.post("experience", {
                company_name: expCompanyName,
                position: expPosition,
                location: expLocation,
                description: expDescription,
                start_date: expStartDate,
                end_date: expEndDate || null
            });
            if (res.status === 201) {
                setExperiences(prev => [res.data, ...prev]);
                resetExpForm();
                toast.success("Tajriba ma'lumoti qo'shildi!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Tajriba qo'shishda xatolik");
        }
    };

    const handleDeleteExperience = async (id) => {
        try {
            await api.delete(`experience/${id}`);
            setExperiences(prev => prev.filter(item => item.id !== id));
            if (editingExpId === id) resetExpForm();
            toast.success("Tajriba o'chirildi");
        } catch (err) {
            toast.error(err.response?.data?.message || "Tajribani o'chirishda xatolik");
        }
    };

    // Education Handlers
    const resetEduForm = () => {
        setEduPlace("");
        setEduDegree("");
        setEduLocation("");
        setEduDescription("");
        setEduStartDate("");
        setEduEndDate("");
        setEduCourseName("");
        setEditingEduId(null);
    };

    const handleEditEducation = (item) => {
        setEditingEduId(item.id);
        setEduPlace(item.education_place || "");
        setEduCourseName(item.course_name || "");
        setEduDegree(item.degree || "");
        setEduLocation(item.location || "");
        setEduDescription(item.description || "");
        setEduStartDate(item.start_date ? item.start_date.slice(0, 10) : "");
        setEduEndDate(item.end_date ? item.end_date.slice(0, 10) : "");
    };

    const handleAddEducation = async (e) => {
        if (e) e.preventDefault();
        if (!eduPlace || !eduLocation || !eduStartDate || !eduEndDate || !eduCourseName) {
            toast.error("Muassasa nomi, daraja, joylashuv, boshlanish, tugash sanasi va kurs nomi kiritilishi shart!");
            return;
        }
        if (editingEduId) {
            // UPDATE mode
            try {
                const res = await api.put(`education/${editingEduId}`, {
                    education_place: eduPlace,
                    degree: eduDegree,
                    location: eduLocation,
                    description: eduDescription,
                    start_date: eduStartDate,
                    end_date: eduEndDate,
                    course_name: eduCourseName
                });
                setEducations(prev => prev.map(item => item.id === editingEduId ? { ...item, ...res.data } : item));
                resetEduForm();
                toast.success("Ta'lim yangilandi!");
            } catch (err) {
                toast.error(err.response?.data?.message || "Ta'limni yangilashda xatolik");
            }
            return;
        }
        try {
            const res = await api.post("education", {
                education_place: eduPlace,
                degree: eduDegree,
                location: eduLocation,
                description: eduDescription,
                start_date: eduStartDate,
                end_date: eduEndDate,
                course_name: eduCourseName
            });
            if (res.status === 201) {
                setEducations(prev => [res.data, ...prev]);
                resetEduForm();
                toast.success("Ta'lim ma'lumoti qo'shildi!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Ta'lim qo'shishda xatolik");
        }
    };

    const handleDeleteEducation = async (id) => {
        try {
            await api.delete(`education/${id}`);
            setEducations(prev => prev.filter(item => item.id !== id));
            if (editingEduId === id) resetEduForm();
            toast.success("Ta'lim ma'lumoti o'chirildi");
        } catch (err) {
            toast.error(err.response?.data?.message || "Ta'limni o'chirishda xatolik");
        }
    };

    // Portfolio Handlers
    const handleCoverFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPortCoverFile(file);
            setPortCoverPreview(URL.createObjectURL(file));
        }
    };

    const resetPortForm = () => {
        setPortTitle("");
        setPortDescription("");
        setPortDemoUrl("");
        setPortGithubUrl("");
        setPortTechnologies("");
        setPortHint("");
        setPortCoverFile(null);
        setPortCoverPreview("");
        setEditingPortId(null);
    };

    const handleEditPortfolio = (item) => {
        setEditingPortId(item.id);
        setPortTitle(item.title || "");
        setPortDescription(item.description || "");
        setPortDemoUrl(item.demo_url || "");
        setPortGithubUrl(item.github_url || "");
        setPortTechnologies(Array.isArray(item.technologies) ? item.technologies.join(", ") : (item.technologies || ""));
        setPortHint(item.hint || "");
        setPortCoverPreview(item.cover_image || "");
        setPortCoverFile(null);
        // Scroll to form
        setTimeout(() => document.getElementById('portfolio-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    };

    const handleAddPortfolio = async (e) => {
        e.preventDefault();
        if (!portTitle) {
            toast.error("Portfolio loyihasi uchun sarlavha (title) kiriting!");
            return;
        }
        if (!portDemoUrl && !portGithubUrl) {
            toast.error("Demo URL yoki GitHub URL kiritilishi shart!");
            return;
        }

        const techArray = portTechnologies
            ? portTechnologies.split(",").map(t => t.trim()).filter(Boolean)
            : [];

        if (techArray.length === 0) {
            toast.error("Ishlatilgan texnologiyalarni kamida bittasini kiriting (vergul bilan)!");
            return;
        }

        if (editingPortId) {
            // UPDATE mode
            try {
                setAddingPort(true);
                const res = await api.put(`portfolio/${editingPortId}`, {
                    title: portTitle,
                    description: portDescription,
                    demo_url: portDemoUrl,
                    github_url: portGithubUrl,
                    technologies: techArray,
                    hint: portHint
                });
                let updatedItem = { ...res.data };
                if (portCoverFile) {
                    const formData = new FormData();
                    formData.append("cover", portCoverFile);
                    try {
                        const coverRes = await api.patch(`portfolio/cover/${editingPortId}`, formData, {
                            headers: { "Content-Type": "multipart/form-data" }
                        });
                        if (coverRes.data?.cover_image) updatedItem.cover_image = coverRes.data.cover_image;
                    } catch (cErr) { console.error("Cover update failed:", cErr); }
                }
                setPortfolios(prev => prev.map(item => item.id === editingPortId ? { ...item, ...updatedItem } : item));
                resetPortForm();
                toast.success("Portfolio yangilandi!");
            } catch (err) {
                toast.error(err.response?.data?.message || "Portfolio yangilashda xatolik");
            } finally {
                setAddingPort(false);
            }
            return;
        }

        try {
            setAddingPort(true);
            const res = await api.post("portfolio", {
                title: portTitle,
                description: portDescription,
                demo_url: portDemoUrl,
                github_url: portGithubUrl,
                technologies: techArray,
                hint: portHint
            });

            let newPortfolioItem = res.data;

            if (portCoverFile && newPortfolioItem?.id) {
                const formData = new FormData();
                formData.append("cover", portCoverFile);
                try {
                    const coverRes = await api.patch(`portfolio/cover/${newPortfolioItem.id}`, formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    if (coverRes.data?.cover_image) {
                        newPortfolioItem.cover_image = coverRes.data.cover_image;
                    }
                } catch (cErr) {
                    console.error("Cover image upload failed:", cErr);
                }
            }

            setPortfolios(prev => [newPortfolioItem, ...prev]);
            resetPortForm();
            toast.success("Portfolio loyihasi qo'shildi!");
        } catch (err) {
            console.error("Add portfolio error:", err);
            toast.error(err.response?.data?.message || "Portfolio qo'shishda xatolik");
        } finally {
            setAddingPort(false);
        }
    };

    const handleDeletePortfolio = async (id) => {
        try {
            await api.delete(`portfolio/${id}`);
            setPortfolios(prev => prev.filter(item => item.id !== id));
            if (editingPortId === id) resetPortForm();
            toast.success("Portfolio loyihasi o'chirildi");
        } catch (err) {
            toast.error(err.response?.data?.message || "Loyihani o'chirishda xatolik");
        }
    };

    // Awards & Certificates Handlers
    const handleAwardFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAwardImageFile(file);
            setAwardImagePreview(URL.createObjectURL(file));
        }
    };

    const resetAwardForm = () => {
        setAwardTitle("");
        setAwardDescription("");
        setAwardDate("");
        setAwardImageFile(null);
        setAwardImagePreview("");
        setEditingAwardId(null);
    };

    const handleEditAward = (item) => {
        setEditingAwardId(item.id);
        setAwardTitle(item.title || "");
        setAwardDescription(item.description || "");
        setAwardDate(item.date_achived ? item.date_achived.slice(0, 10) : "");
        setAwardImagePreview(item.image_url || "");
        setAwardImageFile(null);
        setTimeout(() => document.getElementById('award-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    };

    const handleAddAward = async (e) => {
        e.preventDefault();
        if (!awardTitle || !awardDescription || !awardDate) {
            toast.error("Nomi, tavsifi va olingan sanasi kiritilishi shart!");
            return;
        }

        if (editingAwardId) {
            // UPDATE mode
            try {
                setAddingAward(true);
                const res = await api.put(`awards/${editingAwardId}`, {
                    title: awardTitle,
                    description: awardDescription,
                    date_achived: awardDate
                });
                let updatedItem = { ...res.data };
                if (awardImageFile) {
                    const formData = new FormData();
                    formData.append("image", awardImageFile);
                    try {
                        const imgRes = await api.patch(`awards/${editingAwardId}`, formData, {
                            headers: { "Content-Type": "multipart/form-data" }
                        });
                        if (imgRes.data?.image_url) updatedItem.image_url = imgRes.data.image_url;
                    } catch (imgErr) { console.error("Award image update error:", imgErr); }
                }
                setAwards(prev => prev.map(item => item.id === editingAwardId ? { ...item, ...updatedItem } : item));
                resetAwardForm();
                toast.success("Sertifikat/Yutuq yangilandi!");
            } catch (err) {
                toast.error(err.response?.data?.message || "Sertifikatni yangilashda xatolik");
            } finally {
                setAddingAward(false);
            }
            return;
        }

        try {
            setAddingAward(true);
            const res = await api.post("awards", {
                title: awardTitle,
                description: awardDescription,
                date_achived: awardDate
            });

            let newAwardItem = res.data;

            if (awardImageFile && newAwardItem?.id) {
                const formData = new FormData();
                formData.append("image", awardImageFile);
                try {
                    const imgRes = await api.patch(`awards/${newAwardItem.id}`, formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    if (imgRes.data?.image_url) {
                        newAwardItem.image_url = imgRes.data.image_url;
                    }
                } catch (imgErr) {
                    console.error("Award image upload error:", imgErr);
                }
            }

            setAwards(prev => [newAwardItem, ...prev]);
            resetAwardForm();
            toast.success("Sertifikat/Yutuq muvaffaqiyatli qo'shildi!");
        } catch (err) {
            console.error("Add award error:", err);
            toast.error(err.response?.data?.message || "Sertifikat qo'shishda xatolik");
        } finally {
            setAddingAward(false);
        }
    };

    const handleDeleteAward = async (id) => {
        try {
            await api.delete(`awards/${id}`);
            setAwards(prev => prev.filter(item => item.id !== id));
            if (editingAwardId === id) resetAwardForm();
            toast.success("Sertifikat o'chirildi");
        } catch (err) {
            toast.error(err.response?.data?.message || "Sertifikatni o'chirishda xatolik");
        }
    };

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center p-12 text-slate-400 font-mono text-sm">
                <Loader2 className="w-6 h-6 animate-spin mr-2 text-blue-400" />
                SOZLAMALAR YUKLANMOQDA...
            </div>
        );
    }

    return (
        <div className='w-full flex flex-col font-mono gap-4 pb-24 text-slate-200'>
            
            {/* 1. ACCOUNT SETTINGS */}
            <div className='bg-[#0e101c] border border-white/12'>
                <div
                    onClick={() => setOpenAccount(!openAccount)}
                    className='w-full cursor-pointer border-b border-white/12 py-4 px-5 flex justify-between items-center select-none'
                >
                    <h1 className='uppercase font-semibold text-white'>Account settings</h1>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openAccount ? 'rotate-180' : ''}`} />
                </div>

                {openAccount && (
                    <form onSubmit={handleUpdate} className='flex flex-col gap-6 p-4'>
                        {/* Avatar section */}
                        <div className="flex items-center gap-4 border-b border-white/12 pb-4">
                            <div className="relative w-16 h-16 border border-white/12 overflow-hidden bg-black/40 flex items-center justify-center shrink-0">
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-lg text-white uppercase">{firstName?.charAt(0) || username?.charAt(0) || 'U'}</span>
                                )}
                                {avatarUploading && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 text-blue-300 animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-white">@{username}</span>
                                <label className="cursor-pointer text-xs text-blue-300 hover:underline flex items-center gap-1">
                                    <Upload size={14} />
                                    <span>Avatar almashtirish</span>
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Personal Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <input type="text" value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white'
                                placeholder='username' />

                            <input type="text" value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white'
                                placeholder='first name' />

                            <input type="text" value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white'
                                placeholder='last name' />

                            <input type="email" value={email}
                                disabled
                                className='px-2 py-1.5 border border-white/12 outline-none bg-white/5 text-sm text-slate-400 cursor-not-allowed'
                                placeholder='email' />

                            <input type="number" step="any" value={experienceYears}
                                onChange={(e) => setExperienceYears(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white'
                                placeholder='experience years' />

                            <input type="number" value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white'
                                placeholder='age' />

                            <input type="text" value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white'
                                placeholder='job title' />

                            <input type="text" value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white sm:col-span-2'
                                placeholder='location' />
                        </div>

                        {/* Textareas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <textarea value={headline} onChange={(e) => setHeadline(e.target.value)}
                                rows={2}
                                className='px-2 py-1.5 border border-white/12 outline-none resize-none focus:border-blue-300/80 bg-transparent text-sm text-white'
                                placeholder="headline" />

                            <textarea value={about} onChange={(e) => setAbout(e.target.value)}
                                rows={2}
                                className='px-2 py-1.5 border border-white/12 outline-none resize-none focus:border-blue-300/80 bg-transparent text-sm text-white'
                                placeholder="about" />
                        </div>

                        {/* Social Links Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/12">
                            <input type="text" value={github} onChange={(e) => setGithub(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white' placeholder='github username' />
                            <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white' placeholder='linkedin url' />
                            <input type="text" value={telegram} onChange={(e) => setTelegram(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white' placeholder='telegram username' />
                            <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white' placeholder='instagram url' />
                            <input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white' placeholder='youtube url' />
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white' placeholder='phone' />
                            <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white' placeholder='website url' />
                            <input type="text" value={leetcodeUsername} onChange={(e) => setLeetcodeUsername(e.target.value)}
                                className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-sm text-white' placeholder='leetcode username' />
                        </div>
                    </form>
                )}
            </div>

            {/* 2. TECHNOLOGIES SETTINGS */}
            <div className='bg-[#0e101c] border border-white/12'>
                <div
                    onClick={() => setOpenTechnologies(!openTechnologies)}
                    className='w-full cursor-pointer border-b border-white/12 py-4 px-5 flex justify-between items-center select-none'
                >
                    <h1 className='uppercase font-semibold'>Technologies settings</h1>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openTechnologies ? 'rotate-180' : ''}`} />
                </div>

                {openTechnologies && (
                    <div className='p-4 flex flex-col gap-6'>
                        {/* List current technologies */}
                        <div className="flex flex-wrap gap-2">
                            {technologies.length === 0 ? (
                                <span className="text-xs text-slate-400 italic">No technologies added</span>
                            ) : (
                                technologies.map((tech) => (
                                    <div key={tech.id} className="flex items-center gap-2 px-3 py-1 border border-white/12 bg-white/5 text-xs text-white">
                                        {editingTechId === tech.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editingTechName}
                                                    onChange={e => setEditingTechName(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleUpdateTechnology(); } if (e.key === 'Escape') { setEditingTechId(null); setEditingTechName(""); } }}
                                                    className="bg-transparent outline-none border-b border-blue-300/60 text-white text-xs w-24"
                                                    autoFocus
                                                />
                                                <button type="button" onClick={handleUpdateTechnology} className="text-blue-400 hover:text-blue-200 transition-colors cursor-pointer">
                                                    <Send size={12} />
                                                </button>
                                                <button type="button" onClick={() => { setEditingTechId(null); setEditingTechName(""); }} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                                                    <X size={13} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span>{tech.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditTechnology(tech)}
                                                    className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteTechnology(tech.id)}
                                                    className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add new technology */}
                        <div className="flex items-center gap-3">
                            <div className='flex items-center border border-white/12'>
                                <input
                                    type="text"
                                    value={newTech}
                                    onChange={(e) => setNewTech(e.target.value)}
                                    placeholder="type here"
                                    className='px-2 py-1.5 outline-none bg-transparent text-sm text-white focus:border-blue-300/80'
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTechnology(); } }}
                                />
                                <button
                                    type='button'
                                    onClick={handleAddTechnology}
                                    className='w-max border-l border-white/12 cursor-pointer flex justify-center py-1.5 px-3 items-center hover:bg-white/10 text-white'
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Summary */}
                        <textarea
                            value={technologySummary}
                            onChange={(e) => setTechnologySummary(e.target.value)}
                            placeholder='summary'
                            rows={3}
                            className='px-2 py-1.5 max-w-160 border border-white/12 outline-none resize-none focus:border-blue-300/80 bg-transparent text-sm text-white'
                        ></textarea>
                    </div>
                )}
            </div>

            {/* 3. EXPERIENCE | EDUCATION */}
            <div className="bg-[#0e101c] border border-white/12">
                <div
                    onClick={() => setOpenExpEdu(!openExpEdu)}
                    className='w-full cursor-pointer border-b border-white/12 py-4 px-5 flex justify-between items-center select-none'
                >
                    <h1 className='uppercase font-semibold'>Experience | Education</h1>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openExpEdu ? 'rotate-180' : ''}`} />
                </div>

                {openExpEdu && (
                    <div className='grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/12'>
                        {/* Experience Section */}
                        <div className='p-4 flex flex-col gap-4'>
                            <h1 className="font-semibold text-white">Experience</h1>

                            {/* Existing Experiences */}
                            <div className="flex flex-col gap-3">
                                {experiences.map(item => (
                                    <div key={item.id} className={`p-3 border flex justify-between items-start transition-colors ${editingExpId === item.id ? 'border-blue-400/50 bg-blue-900/10' : 'border-white/12'}`}>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-white text-xs">{item.position} at {item.company_name}</span>
                                            <span className="text-[11px] text-slate-400">{item.location} ({item.start_date ? new Date(item.start_date).toLocaleDateString() : ''} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Present'})</span>
                                            {item.description && <p className="text-xs text-slate-300 mt-1">{item.description}</p>}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleEditExperience(item)} className="text-slate-400 hover:text-blue-400 p-1 cursor-pointer" title="Edit">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteExperience(item.id)} className="text-slate-400 hover:text-red-400 p-1 cursor-pointer" title="Delete">
                                                <Trash size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add/Edit Experience Form */}
                            <div className='flex flex-col gap-3 border border-white/12 p-4'>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-400 uppercase">{editingExpId ? '✏️ Edit Experience' : 'Add Experience'}</span>
                                    {editingExpId && (
                                        <button type="button" onClick={resetExpForm} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
                                            <X size={13} /> Cancel
                                        </button>
                                    )}
                                </div>
                                <input type="text" value={expCompanyName} onChange={e => setExpCompanyName(e.target.value)} placeholder="Company name" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="text" value={expPosition} onChange={e => setExpPosition(e.target.value)} placeholder="Position" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="text" value={expLocation} onChange={e => setExpLocation(e.target.value)} placeholder="Location" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="text" value={expDescription} onChange={e => setExpDescription(e.target.value)} placeholder="Description" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="date" value={expStartDate} onChange={e => setExpStartDate(e.target.value)} className='px-2 py-1 border border-white/12 outline-none bg-transparent text-xs text-white' />
                                    <input type="date" value={expEndDate} onChange={e => setExpEndDate(e.target.value)} className='px-2 py-1 border border-white/12 outline-none bg-transparent text-xs text-white' />
                                </div>
                                <button type='button' onClick={handleAddExperience} className={`w-full py-2 cursor-pointer flex justify-center items-center gap-1 text-xs text-white ${editingExpId ? 'bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30' : 'bg-white/12 hover:bg-white/20'}`}>
                                    {editingExpId ? <><Send size={13} /> Update</> : <><Plus size={15} /> Add</>}
                                </button>
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className='p-4 flex flex-col gap-4'>
                            <h1 className="font-semibold text-white">Education</h1>

                            {/* Existing Educations */}
                            <div className="flex flex-col gap-3">
                                {educations.map(item => (
                                    <div key={item.id} className={`p-3 border flex justify-between items-start transition-colors ${editingEduId === item.id ? 'border-blue-400/50 bg-blue-900/10' : 'border-white/12'}`}>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-white text-xs">{item.education_place} ({item.degree})</span>
                                            <span className="text-[11px] text-slate-400">{item.location} ({item.start_date ? new Date(item.start_date).toLocaleDateString() : ''} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Present'})</span>
                                            {item.description && <p className="text-xs text-slate-300 mt-1">{item.description}</p>}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleEditEducation(item)} className="text-slate-400 hover:text-blue-400 p-1 cursor-pointer" title="Edit">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteEducation(item.id)} className="text-slate-400 hover:text-red-400 p-1 cursor-pointer" title="Delete">
                                                <Trash size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add/Edit Education Form */}
                            <div className='flex flex-col gap-3 border border-white/12 p-4'>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-400 uppercase">{editingEduId ? '✏️ Edit Education' : 'Add Education'}</span>
                                    {editingEduId && (
                                        <button type="button" onClick={resetEduForm} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
                                            <X size={13} /> Cancel
                                        </button>
                                    )}
                                </div>
                                <input type="text" value={eduPlace} onChange={e => setEduPlace(e.target.value)} placeholder="Education name" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="text" value={eduCourseName} onChange={e => setEduCourseName(e.target.value)} placeholder="Course name" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="text" value={eduDegree} onChange={e => setEduDegree(e.target.value)} placeholder="Degree" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="text" value={eduLocation} onChange={e => setEduLocation(e.target.value)} placeholder="Location" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="text" value={eduDescription} onChange={e => setEduDescription(e.target.value)} placeholder="Description" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="date" value={eduStartDate} onChange={e => setEduStartDate(e.target.value)} className='px-2 py-1 border border-white/12 outline-none bg-transparent text-xs text-white' />
                                    <input type="date" value={eduEndDate} onChange={e => setEduEndDate(e.target.value)} className='px-2 py-1 border border-white/12 outline-none bg-transparent text-xs text-white' />
                                </div>
                                <button type='button' onClick={handleAddEducation} className={`w-full py-2 cursor-pointer flex justify-center items-center gap-1 text-xs text-white ${editingEduId ? 'bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30' : 'bg-white/12 hover:bg-white/20'}`}>
                                    {editingEduId ? <><Send size={13} /> Update</> : <><Plus size={15} /> Add</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. PORTFOLIO SETTINGS */}
            <div className='bg-[#0e101c] border border-white/12'>
                <div
                    onClick={() => setOpenPortfolio(!openPortfolio)}
                    className='w-full cursor-pointer border-b border-white/12 py-4 px-5 flex justify-between items-center select-none'
                >
                    <h1 className='uppercase font-semibold'>Portfolio settings</h1>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openPortfolio ? 'rotate-180' : ''}`} />
                </div>

                {openPortfolio && (
                    <div className='p-4 flex flex-col gap-6'>
                        {/* List Existing Portfolios */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {portfolios.length === 0 ? (
                                <span className="text-xs text-slate-400 italic col-span-full">Portfolio loyihalari yo'q</span>
                            ) : (
                                portfolios.map((item) => (
                                    <div key={item.id} className={`p-3 border flex flex-col justify-between gap-3 transition-colors ${editingPortId === item.id ? 'border-blue-400/50 bg-blue-900/10' : 'border-white/12'}`}>
                                        <div className="flex flex-col gap-2">
                                            {item.cover_image && (
                                                <div className="w-full h-32 border border-white/12 overflow-hidden">
                                                    <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-semibold text-white text-xs uppercase">{item.title}</h3>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleEditPortfolio(item)} className="text-slate-400 hover:text-blue-400 p-1 cursor-pointer" title="Edit">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => handleDeletePortfolio(item.id)} className="text-slate-400 hover:text-red-400 p-1 cursor-pointer" title="Delete">
                                                        <Trash size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                            {item.description && <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>}
                                            {item.technologies && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {(Array.isArray(item.technologies) ? item.technologies : item.technologies.split(',')).map((t, i) => (
                                                        <span key={i} className="text-[10px] border border-white/12 px-1.5 py-0.5 text-slate-300">{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add/Edit Portfolio Form */}
                        <form id="portfolio-form" onSubmit={handleAddPortfolio} className='flex flex-col gap-3 border border-white/12 p-4'>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase">{editingPortId ? '✏️ Edit Portfolio Project' : 'Add Portfolio Project'}</span>
                                {editingPortId && (
                                    <button type="button" onClick={resetPortForm} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
                                        <X size={13} /> Cancel
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input type="text" value={portTitle} onChange={e => setPortTitle(e.target.value)} placeholder="Title" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="text" value={portTechnologies} onChange={e => setPortTechnologies(e.target.value)} placeholder="Technologies (e.g. React, Node.js)" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="text" value={portDemoUrl} onChange={e => setPortDemoUrl(e.target.value)} placeholder="Demo URL" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="text" value={portGithubUrl} onChange={e => setPortGithubUrl(e.target.value)} placeholder="GitHub URL" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                            </div>

                            <input type="text" value={portHint} onChange={e => setPortHint(e.target.value)} placeholder="Hint / Note" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />

                            <textarea value={portDescription} onChange={e => setPortDescription(e.target.value)} placeholder="Description" rows={2} className='px-2 py-1.5 border border-white/12 outline-none resize-none focus:border-blue-300/80 bg-transparent text-xs text-white'></textarea>

                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer px-3 py-1.5 border border-white/12 hover:bg-white/10 text-xs text-white flex items-center gap-1">
                                    <Upload size={14} />
                                    <span>{portCoverFile ? portCoverFile.name : "Choose Cover Image"}</span>
                                    <input type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" />
                                </label>
                                {portCoverPreview && (
                                    <div className="w-12 h-8 border border-white/12 overflow-hidden">
                                        <img src={portCoverPreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <button
                                type='submit'
                                disabled={addingPort}
                                className={`w-full py-2 cursor-pointer flex justify-center items-center gap-1 text-xs text-white uppercase font-semibold disabled:opacity-50 ${editingPortId ? 'bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30' : 'bg-white/12 hover:bg-white/20'}`}
                            >
                                {addingPort ? <Loader2 className="w-4 h-4 animate-spin" /> : editingPortId ? <Send size={15} /> : <Plus size={15} />}
                                <span>{editingPortId ? 'Update Portfolio' : 'Add Portfolio'}</span>
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* 5. AWARDS & CERTIFICATES SETTINGS */}
            <div className='bg-[#0e101c] border border-white/12'>
                <div
                    onClick={() => setOpenAwards(!openAwards)}
                    className='w-full cursor-pointer border-b border-white/12 py-4 px-5 flex justify-between items-center select-none'
                >
                    <h1 className='uppercase font-semibold'>Awards & Certificates settings</h1>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openAwards ? 'rotate-180' : ''}`} />
                </div>

                {openAwards && (
                    <div className='p-4 flex flex-col gap-6'>
                        {/* List Existing Awards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {awards.length === 0 ? (
                                <span className="text-xs text-slate-400 italic col-span-full">Sertifikatlar va yutuqlar yo'q</span>
                            ) : (
                                awards.map((item) => (
                                    <div key={item.id} className={`p-3 border flex flex-col justify-between gap-3 transition-colors ${editingAwardId === item.id ? 'border-blue-400/50 bg-blue-900/10' : 'border-white/12'}`}>
                                        <div className="flex flex-col gap-2">
                                            {item.image_url && (
                                                <div className="w-full h-32 border border-white/12 overflow-hidden">
                                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-semibold text-white text-xs uppercase">{item.title}</h3>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleEditAward(item)} className="text-slate-400 hover:text-blue-400 p-1 cursor-pointer" title="Edit">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => handleDeleteAward(item.id)} className="text-slate-400 hover:text-red-400 p-1 cursor-pointer" title="Delete">
                                                        <Trash size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                            {item.date_achived && <span className="text-[11px] text-amber-400">{new Date(item.date_achived).toLocaleDateString()}</span>}
                                            {item.description && <p className="text-xs text-slate-400">{item.description}</p>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add/Edit Award Form */}
                        <form id="award-form" onSubmit={handleAddAward} className='flex flex-col gap-3 border border-white/12 p-4'>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase">{editingAwardId ? '✏️ Edit Award / Certificate' : 'Add Award / Certificate'}</span>
                                {editingAwardId && (
                                    <button type="button" onClick={resetAwardForm} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
                                        <X size={13} /> Cancel
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input type="text" value={awardTitle} onChange={e => setAwardTitle(e.target.value)} placeholder="Title" className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                                <input type="date" value={awardDate} onChange={e => setAwardDate(e.target.value)} className='px-2 py-1.5 border border-white/12 outline-none focus:border-blue-300/80 bg-transparent text-xs text-white' />
                            </div>

                            <textarea value={awardDescription} onChange={e => setAwardDescription(e.target.value)} placeholder="Description" rows={2} className='px-2 py-1.5 border border-white/12 outline-none resize-none focus:border-blue-300/80 bg-transparent text-xs text-white'></textarea>

                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer px-3 py-1.5 border border-white/12 hover:bg-white/10 text-xs text-white flex items-center gap-1">
                                    <Upload size={14} />
                                    <span>{awardImageFile ? awardImageFile.name : "Choose Certificate Image"}</span>
                                    <input type="file" accept="image/*" onChange={handleAwardFileChange} className="hidden" />
                                </label>
                                {awardImagePreview && (
                                    <div className="w-12 h-8 border border-white/12 overflow-hidden">
                                        <img src={awardImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <button
                                type='submit'
                                disabled={addingAward}
                                className={`w-full py-2 cursor-pointer flex justify-center items-center gap-1 text-xs text-white uppercase font-semibold disabled:opacity-50 ${editingAwardId ? 'bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30' : 'bg-white/12 hover:bg-white/20'}`}
                            >
                                {addingAward ? <Loader2 className="w-4 h-4 animate-spin" /> : editingAwardId ? <Send size={15} /> : <Plus size={15} />}
                                <span>{editingAwardId ? 'Update Award' : 'Add Award'}</span>
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Floating Save Button */}
            <div className="fixed bottom-5 right-5 w-fit h-fit z-40">
                <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className='uppercase cursor-pointer flex items-center gap-3 translate-y-0.25 px-8 py-2 font-medium bg-white text-black rounded-xl hover:bg-white/80 transition-colors duration-300 disabled:opacity-50 text-sm'>
                    {updating ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Send size={18} className='-translate-y-0.25' />}
                    <span>{updating ? "Updating..." : "Update settings"}</span>
                </button>
            </div>
        </div>
    )
}