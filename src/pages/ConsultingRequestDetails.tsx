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
    IndianRupee,
    HelpCircle,
    Target,
    Zap
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { WhatsAppContact } from "@/components/ui/whatsapp-contact";
import Loader from '@/components/ui/loader';

interface ConsultingRequest {
    id: string;
    expertise_needed?: string[];
    description: string;
    urgency: 'low' | 'medium' | 'high';
    whatsapp_number: string;
    created_at: string;
    user_id?: string | null;
    requester?: {
        id: string;
        name: string;
        email: string;
        user_type?: string;
        phone?: string;
    };
}

const ConsultingRequestDetails = () => {
    const { requestId } = useParams<{ requestId: string }>();
    const navigate = useNavigate();
    const [request, setRequest] = useState<ConsultingRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (requestId) {
            fetchRequestDetails();
        }
    }, [requestId]);

    const fetchRequestDetails = async () => {
        try {
            setLoading(true);
            const data = await apiClient.getConsultingRequestById(requestId!);
            setRequest(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch consulting request details');
        } finally {
            setLoading(false);
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high': return 'bg-red-600 text-white';
            case 'medium': return 'bg-yellow-600 text-white';
            case 'low': return 'bg-green-600 text-white';
            default: return 'bg-gray-600 text-white';
        }
    };

    const getUrgencyIcon = (urgency: string) => {
        switch (urgency) {
            case 'high': return <AlertCircle className="h-4 w-4" />;
            case 'medium': return <Clock className="h-4 w-4" />;
            case 'low': return <CheckCircle className="h-4 w-4" />;
            default: return <HelpCircle className="h-4 w-4" />;
        }
    };

    const shareListing = () => {
        if (navigator.share) {
            navigator.share({
                title: `Consulting Request - Cable Hub Connect`,
                text: `Check out this consulting request: ${request?.description}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            // You could add a toast notification here
        }
    };

    const downloadDetails = () => {
        if (!request) return;
        
        const details = `
Consulting Request Details
==========================
Expertise Needed: ${request.expertise_needed?.join(', ') || 'N/A'}
Urgency: ${request.urgency}
Contact: ${request.whatsapp_number}
Description: ${request.description}
Posted Date: ${new Date(request.created_at).toLocaleDateString()}
Requester: ${request.requester?.name || 'N/A'}
        `;
        
        const blob = new Blob([details], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consulting-request-${request.id}.txt`;
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

    if (error || !request) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header
                    title="Request Not Found"
                    onBack={() => navigate('/consulting-listings')}
                    logoSrc='/cableCartLogo.png'
                />
                <div className="container mx-auto px-4 py-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Consulting Request Not Found</h2>
                    <p className="text-gray-600 mb-4">{error || 'The consulting request you are looking for does not exist.'}</p>
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
                title="Consulting Request Details"
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
                {/* Request Header */}
                <div className="mb-4 md:mb-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                                <Badge variant="default" className="text-xs bg-green-600">
                                    Consulting Request
                                </Badge>
                                <Badge className={`text-xs ${getUrgencyColor(request.urgency)}`}>
                                    {getUrgencyIcon(request.urgency)}
                                    <span className="ml-1 capitalize">{request.urgency} Priority</span>
                                </Badge>
                            </div>
                            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
                                Consulting Request
                            </h1>
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-sm md:text-lg">{request.whatsapp_number}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm md:text-lg">Posted {new Date(request.created_at).toLocaleDateString()}</span>
                                </div>
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
                                <CardTitle>Request Details</CardTitle>
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
                                                <FileText className="h-5 w-5 text-green-600" />
                                                Request Description
                                            </h3>
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <p className="text-gray-700 leading-relaxed">{request.description}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                                <Zap className="h-5 w-5 text-red-600" />
                                                Urgency Level
                                            </h3>
                                            <div className={`p-4 rounded-lg text-white ${getUrgencyColor(request.urgency).replace('text-white', '')}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getUrgencyIcon(request.urgency)}
                                                    <span className="font-semibold capitalize">{request.urgency} Priority</span>
                                                </div>
                                                <p className="text-sm opacity-90">
                                                    {request.urgency === 'high' && 'This request requires immediate attention and quick response.'}
                                                    {request.urgency === 'medium' && 'This request has moderate priority and should be addressed soon.'}
                                                    {request.urgency === 'low' && 'This request can be handled at your convenience.'}
                                                </p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="expertise" className="space-y-4 p-4">
                                        {request.expertise_needed && request.expertise_needed.length > 0 ? (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                    <Target className="h-5 w-5 text-blue-600" />
                                                    Expertise Needed
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {request.expertise_needed.map((area, index) => (
                                                        <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                            <div className="flex items-center gap-2">
                                                                <Star className="h-4 w-4 text-blue-600" />
                                                                <span className="font-medium text-blue-800">{area}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                    <p className="text-sm text-yellow-800">
                                                        <strong>Looking for consultants with expertise in:</strong> {request.expertise_needed.join(', ')}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-600">No specific expertise areas mentioned</p>
                                                <p className="text-sm text-gray-500 mt-1">General consulting assistance requested</p>
                                            </div>
                                        )}
                                    </TabsContent>
                                    
                                    <TabsContent value="details" className="space-y-4 p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <Calendar className="h-5 w-5 text-gray-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Posted On</p>
                                                        <p className="font-medium">{new Date(request.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <Phone className="h-5 w-5 text-gray-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Contact Number</p>
                                                        <p className="font-medium">{request.whatsapp_number}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <Zap className="h-5 w-5 text-gray-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Priority Level</p>
                                                        <p className="font-medium capitalize">{request.urgency}</p>
                                                    </div>
                                                </div>
                                                
                                                {request.requester && (
                                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <User className="h-5 w-5 text-gray-600" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">Requester</p>
                                                            <p className="font-medium">{request.requester.name}</p>
                                                        </div>
                                                    </div>
                                                )}
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
                                Respond to Request
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <HelpCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Consulting Request</h3>
                                    <p className="text-sm text-gray-600">
                                        {request.requester?.name || 'Client'} is looking for expert consultation
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getUrgencyIcon(request.urgency)}
                                        <span className="font-medium capitalize">{request.urgency} Priority</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {request.expertise_needed && request.expertise_needed.length > 0 
                                            ? `Needs expertise in: ${request.expertise_needed.slice(0, 2).join(', ')}${request.expertise_needed.length > 2 ? '...' : ''}`
                                            : 'General consulting assistance needed'
                                        }
                                    </p>
                                </div>

                                <Separator />

                                {apiClient.isAuthenticated() ? (
                                    <div className="space-y-3">
                                        <WhatsAppContact
                                            phoneNumber={request.whatsapp_number}
                                            consultantName="Consultant"
                                            variant="default"
                                            size="default"
                                            className="w-full bg-green-600 hover:bg-green-700 transition-colors text-sm md:text-base"
                                            defaultMessage={`Hi, I am interested in your consulting request regarding ${request.expertise_needed?.slice(0, 2).join(', ') || 'your project'}. I have relevant experience and would like to discuss how I can help. Please share more details about your requirements.`}
                                        >
                                            Contact Requester
                                        </WhatsAppContact>
                                        
                                        <div className="text-xs text-gray-500 text-center">
                                            As a consultant, you can help with this request
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="text-center text-sm text-gray-600">
                                            Login to respond to this request
                                        </div>
                                        <Button
                                            onClick={() => navigate('/login')}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-sm md:text-base"
                                        >
                                            Login to Respond
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

export default ConsultingRequestDetails;