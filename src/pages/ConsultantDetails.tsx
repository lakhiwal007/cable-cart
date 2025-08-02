import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    User,
    Phone,
    Mail,
    Globe,
    FileText,
    MessageCircle,
    Star,
    Clock,
    AlertCircle,
    CheckCircle,
    Truck,
    DollarSign,
    Scale,
    Shield,
    Eye,
    Share2,
    Bookmark,
    Download,
    TrendingUp,
    Award,
    Briefcase,
    GraduationCap,
    Building,
    IndianRupee
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { WhatsAppContact } from "@/components/ui/whatsapp-contact";
import Loader from '@/components/ui/loader';

interface Consultant {
    id: string;
    name: string;
    whatsapp_number: string;
    experience_years?: number;
    expertise_areas?: string[];
    cable_product_types?: string[];
    description: string;
    is_incognito?: boolean;
    is_verified?: boolean;
    is_active: boolean;
    created_at: string;
    user_id?: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
        user_type?: string;
        phone?: string;
    };
}

const ConsultantDetails = () => {
    const { consultantId } = useParams<{ consultantId: string }>();
    const navigate = useNavigate();
    const [consultant, setConsultant] = useState<Consultant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (consultantId) {
            fetchConsultantDetails();
        }
    }, [consultantId]);

    const fetchConsultantDetails = async () => {
        try {
            setLoading(true);
            const data = await apiClient.getConsultantById(consultantId!);
            setConsultant(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch consultant details');
        } finally {
            setLoading(false);
        }
    };

    const shareListing = () => {
        if (navigator.share) {
            navigator.share({
                title: `${consultant?.name || 'Consultant'} - Cable Hub Connect`,
                text: `Check out this consultant: ${consultant?.description}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            // You could add a toast notification here
        }
    };

    const downloadDetails = () => {
        if (!consultant) return;
        
        const details = `
Consultant Details
==================
Name: ${consultant.is_incognito ? 'Anonymous Expert' : consultant.name}
Experience: ${consultant.experience_years || 'N/A'} years
Contact: ${consultant.whatsapp_number}
Expertise Areas: ${consultant.expertise_areas?.join(', ') || 'N/A'}
Cable Product Types: ${consultant.cable_product_types?.join(', ') || 'N/A'}
Description: ${consultant.description}
Verified: ${consultant.is_verified ? 'Yes' : 'No'}
Registration Date: ${new Date(consultant.created_at).toLocaleDateString()}
        `;
        
        const blob = new Blob([details], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consultant-${consultant.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error || !consultant) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header
                    title="Consultant Not Found"
                    onBack={() => navigate('/consulting-listings')}
                    logoSrc='/cableCartLogo.png'
                />
                <div className="container mx-auto px-4 py-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Consultant Not Found</h2>
                    <p className="text-gray-600 mb-4">{error || 'The consultant you are looking for does not exist.'}</p>
                    <Button onClick={() => navigate('/consulting-listings')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Consulting Listings
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header
                title="Consultant Details"
                onBack={() => navigate('/consulting-listings')}
                logoSrc='/cableCartLogo.png'
                rightContent={
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={shareListing} className="hidden sm:flex">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsBookmarked(!isBookmarked)} className="hidden sm:flex">
                            <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                            {isBookmarked ? 'Saved' : 'Save'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadDetails} className="hidden sm:flex">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                }
            />
            <div className="container mx-auto px-4 py-4 md:py-8">
                {/* Consultant Header */}
                <div className="mb-4 md:mb-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                                <Badge variant="default" className="text-xs bg-blue-600">
                                    Consultant
                                </Badge>
                                {consultant.is_verified && (
                                    <Badge variant="default" className="text-xs bg-green-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
                                {consultant.is_incognito ? 'Anonymous Expert' : consultant.name}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-sm md:text-lg">{consultant.whatsapp_number}</span>
                                </div>
                                {consultant.experience_years && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm md:text-lg">{consultant.experience_years} years experience</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile action buttons */}
                        <div className="flex gap-1 sm:hidden">
                            <Button variant="outline" size="sm" onClick={shareListing}>
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
                                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadDetails}>
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="px-4 py-2">
                                <CardTitle>Consultant Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                                        <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
                                        <TabsTrigger value="expertise" className="text-xs sm:text-sm py-2">Expertise</TabsTrigger>
                                        <TabsTrigger value="details" className="text-xs sm:text-sm py-2">Details</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="overview" className="space-y-4 p-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                                About
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed">{consultant.description}</p>
                                        </div>

                                        {consultant.experience_years && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                                    <Briefcase className="h-5 w-5 text-green-600" />
                                                    Experience
                                                </h3>
                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-700 mb-1">
                                                        {consultant.experience_years} Years
                                                    </div>
                                                    <p className="text-sm text-green-600">Professional Experience</p>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                    
                                    <TabsContent value="expertise" className="space-y-4 p-4">
                                        {consultant.expertise_areas && consultant.expertise_areas.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                    <Award className="h-5 w-5 text-purple-600" />
                                                    Areas of Expertise
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {consultant.expertise_areas.map((area, index) => (
                                                        <div key={index} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                                            <div className="flex items-center gap-2">
                                                                <Star className="h-4 w-4 text-purple-600" />
                                                                <span className="font-medium text-purple-800">{area}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {consultant.cable_product_types && consultant.cable_product_types.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                    <Building className="h-5 w-5 text-orange-600" />
                                                    Cable Product Types
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {consultant.cable_product_types.map((product, index) => (
                                                        <div key={index} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                                            <div className="flex items-center gap-2">
                                                                <Scale className="h-4 w-4 text-orange-600" />
                                                                <span className="font-medium text-orange-800">{product}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                    
                                    <TabsContent value="details" className="space-y-4 p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <User className="h-5 w-5 text-gray-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Display Mode</p>
                                                        <p className="font-medium">{consultant.is_incognito ? 'Anonymous' : 'Public Profile'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <Shield className="h-5 w-5 text-gray-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Verification Status</p>
                                                        <p className="font-medium">{consultant.is_verified ? 'Verified' : 'Unverified'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <Calendar className="h-5 w-5 text-gray-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Registered</p>
                                                        <p className="font-medium">{new Date(consultant.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <CheckCircle className="h-5 w-5 text-gray-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Status</p>
                                                        <p className="font-medium">{consultant.is_active ? 'Active' : 'Inactive'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Card */}
                    <Card>
                        <CardHeader className="px-4 py-2">
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Contact Consultant
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <User className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">
                                        {consultant.is_incognito ? 'Anonymous Expert' : consultant.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">Professional Consultant</p>
                                </div>

                                <Separator />

                                {apiClient.isAuthenticated() ? (
                                    <div className="space-y-3">
                                        <WhatsAppContact
                                            phoneNumber={consultant.whatsapp_number}
                                            consultantName={consultant.is_incognito ? 'Anonymous Expert' : consultant.name}
                                            variant="default"
                                            size="default"
                                            className="w-full bg-green-600 hover:bg-green-700 transition-colors text-sm md:text-base"
                                            defaultMessage={`Hi, I would like to connect regarding your consulting expertise in ${consultant.expertise_areas?.slice(0, 2).join(', ') || 'cable industry'}. Please provide more details about your services.`}
                                        >
                                            Contact via WhatsApp
                                        </WhatsAppContact>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="text-center text-sm text-gray-600">
                                            Login to contact consultant
                                        </div>
                                        <Button
                                            onClick={() => navigate('/login')}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-sm md:text-base"
                                        >
                                            Login to Contact
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default ConsultantDetails;