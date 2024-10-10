"use client"

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Input, Spacer, Select, SelectItem, Textarea, Button, Checkbox, Divider, Autocomplete, AutocompleteItem, useDisclosure, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Link, Image } from "@nextui-org/react";
import { programs, genderOptions, educationLevelOptions, industrySkills, businessSkills, technicalSkills } from "@/app/data/program-data";
import { batSubmit } from "@/app/lib/services/action";

interface FormProps {
  batSearchType: string;
}

interface Education {
  id: number,
  educationLevel: string;
  program: string;
  university: string;
  gradYear: number;
}

interface Profile {
  firstName: string;
  lastName: string;
  primaryEmail: string;
  personalEmail: string;
  phone: string;
  linkedIn: string;
  gender: string;
  expertise: string;
  interest: string;
  about: string;
  education: Education[];
}

interface BatData {
  batType: string;
  cofounderTitle: string;
  cofounderDescription: string;
  startupDescription: string;
  startupLocation: string;
  problemStatement: string;
  startupTechnology: string;
  skills: { [key: string]: string[] };
  skillsOtherOption: { [key: string]: string };
  profile: Profile;
  startupImage: string; 
  profileImage: string;
}

interface Category {
  key: string;
  cofounderSearchHeader: string;
  startupSearchHeader: string;
  maxOptions: number;
  skills: string[];
}

const ProgramFormComponent: React.FC<FormProps> = ({ batSearchType }) => {

  const router = useRouter();

  // skill categories stored in BatData.skills[key]
  const categories: Category[] = [
    {
      key: "industry",
      cofounderSearchHeader: "In what industry is your startup in?",
      startupSearchHeader: "What is the industry of this startup?",
      maxOptions: 1,
      skills: industrySkills
    },
    {
      key: "technical",
      cofounderSearchHeader: "What is the technical area of expertise of the cofounder you are looking for",
      startupSearchHeader: "What is the technology in this startup that you are interested in?",
      maxOptions: 3,
      skills: technicalSkills
    },
    {
      key: "business",
      cofounderSearchHeader: "What would be the organizational functional area that the cofounder you are looking for should focus on?",
      startupSearchHeader: "In what organizational functional areas would you like to work in this startup?",
      maxOptions: 3,
      skills: businessSkills
    }
  ];

  let initialBatData: BatData = {
    batType: batSearchType,
    cofounderTitle: "", // only required for cofounder search
    cofounderDescription: "", // only required for cofounder search
    startupDescription: "", // startup name for cofounder search, startup description for startup search
    startupLocation: "",
    problemStatement: "", // only required for cofounder search
    startupTechnology: "", // only required for cofounder search
    profile: {
      firstName: "",
      lastName: "",
      primaryEmail: "",
      personalEmail: "",
      phone: "",
      linkedIn: "",
      gender: "",
      expertise: "",
      interest: "",
      about: "",
      education: [{
        id: 0,
        educationLevel: "",
        program: "",
        university: "",
        gradYear: -1
      }]
    },
    startupImage: "",
    profileImage: "",
    skills: Object.fromEntries(
      categories.map(category => [category.key, []])
    ),
    skillsOtherOption: Object.fromEntries(
      categories.map(category => [category.key, ""])
    ),
  }

  const [batData, setBatData] = useState<BatData>(initialBatData);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [aboutWordCount, setAboutWordCount] = useState(0);
  const [problemStatementWordCount, setProblemStatementWordCount] = useState(0);
  const [startupTechWordCount, setStartupTechWordCount] = useState(0);
  const [cofounderDescriptionWordCount, setCofounderDescriptionWordCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [startupImage, setStartupImage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const submitProgramForm = async (e: any) => {
    e.preventDefault();
    console.log(batData)
    const res = await batSubmit(batData);
    if (res.success) {
      router.push('/programs/confirmation');
    } else if (res.errors) {
      setErrors(res.errors);
      onOpen();
    }
  }

  const splitWords = (value: string) => {
    return value.trim().match(/\S+/g) || [];
  }

  const handleAboutWordCount = (value: string) => {
    setAboutWordCount(splitWords(value).length);
  }

  const handleProblemStatementWordCount = (value: string) => {
    setProblemStatementWordCount(splitWords(value).length);
  }

  const handleStartupTechWordCount = (value: string) => {
    setStartupTechWordCount(splitWords(value).length);
  }

  const handleCofounderDescriptionWordCount = (value: string) => {
    setCofounderDescriptionWordCount(splitWords(value).length);
  }

  const handleInputFieldChange = (key: string, value: string) => {
    setBatData(prevState => ({...prevState, [key]: value}));
  }

  const handleProfileInputFieldChange = (key: string, value: string) => {
    setBatData(prevState => ({
      ...prevState, 
      profile: { 
        ...prevState.profile, 
        [key]: value 
      }
    }));
  }

  const handleProfileEducationChange = (eduIndex: number, key: string, value: string | number) => {
    setBatData(prevState => {
      const updatedEducation = [...prevState.profile.education];
      const updatedEducationItem = { ...updatedEducation[eduIndex], [key]: value };
      updatedEducation[eduIndex] = updatedEducationItem;
      return { 
        ...prevState, 
        profile: {
          ...prevState.profile,
          education: updatedEducation
        }
      };
    });
  };

  const handleAddEducation = () => {
    setBatData(prevState => {
      const updatedEducation = [...prevState.profile.education];
      updatedEducation.push({
        id: updatedEducation[updatedEducation.length - 1].id + 1,
        educationLevel: "",
        program: "",
        university: "",
        gradYear: -1
      });
      return { 
        ...prevState, 
        profile: {
          ...prevState.profile,
          education: updatedEducation
        }
      };
    });
  };

  const handleRemoveEducation = (eduIndex: number) => {
    setBatData(prevState => {
      const updatedEducation = [...prevState.profile.education];
      updatedEducation.splice(eduIndex, 1);
      return { 
        ...prevState, 
        profile: {
          ...prevState.profile,
          education: updatedEducation
        }
      };
    });
  };

  const handleSkillsChange = (categoryName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setBatData(prevState => {
      const updatedSkills = { ...prevState.skills };
      if (e.target.checked) {
        updatedSkills[categoryName] = [...updatedSkills[categoryName], e.target.value];
      } else {
        updatedSkills[categoryName] = updatedSkills[categoryName].filter(id => id !== e.target.value);
      }
      return { ...prevState, skills: updatedSkills };
    });
  }

  const handleSkillsOtherOptionChange = (key: string, value: string) => {
    setBatData(prevState => ({
      ...prevState,
      skillsOtherOption: { ...prevState.skillsOtherOption, [key]: value }
    }));
  }

  const handleImageUpload = (key: string, e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (key === "startupImage") {
        setStartupImage(reader.result as string);
      } else {
        setProfileImage(reader.result as string);
      }
      setBatData(prevState => ({...prevState, [key]: reader.result}));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="px-2">
      { batSearchType === "Cofounder Search" && (
        <>
          <div className="border rounded-xl p-6">
            <p className="font-bold text-xl">
              What are you looking for?
            </p>
            <Spacer y={2} />
            <Input
              type="text"
              label="Cofounder Title"
              placeholder={"Example: Software Engineer"}
              onValueChange={(val) => handleInputFieldChange("cofounderTitle", val)}
              isRequired
            />
            <Spacer y={4} />
            <Divider className="mt-2 mb-4" />
            <p className="font-bold text-xl">
              Please describe the talents and expected duties of the cofounder.
            </p>
            <Spacer y={2} />
            <Textarea
              type="text"
              label="Cofounder Description"
              placeholder={"Example: We are looking for a software engineer specialized in machine learning and neural network using python. You will be part of a development team that will be working on signature fraud identification system that provides Saas to IBM and AMAZON."}
              description={"Tell us about your problem statement in 50 words. (" + cofounderDescriptionWordCount + "/50)"}
              onValueChange={(val) => {
                handleInputFieldChange("cofounderDescription", val)
                handleCofounderDescriptionWordCount(val)
              }}
              isRequired
            />
          </div>
          <Spacer y={8} />
        </>
      )}

      <div className="border rounded-xl p-6">
        <p className="font-bold text-xl">
          { batSearchType === "Cofounder Search" ? "Tell us about your startup." : "Tell us about your ideal startup." }
        </p>
        <Spacer y={2} />
        { batSearchType === "Cofounder Search" &&
          <>
            { startupImage && <> <Image width={220} className="mr-3" src={startupImage} alt="Hatchery"/> <Spacer y={2} /> </> }          
            <span className="mr-2"> Upload Photo: </span>
            <input type="file" className="w-[105px]" onChange={e => handleImageUpload("startupImage", e)} accept="image/png, image/jpeg" />
            <Spacer y={2} />
          </>
        }
        <Input
          type="text"
          label={ batSearchType === "Cofounder Search" ? "Startup Name" : "Startup Description" }
          placeholder={ batSearchType === "Cofounder Search" ? "" : "Example: This startup should be focused in the sequestration of CO2 and the greening of the construction industry." }
          onValueChange={(val) => handleInputFieldChange("startupDescription", val)}
          isRequired
        />
        <Spacer y={2} />
        <Input
          type="text"
          label="Startup Location"
          placeholder={"Example: Toronto"}
          onValueChange={(val) => handleInputFieldChange("startupLocation", val)}
          isRequired
        />
        {batSearchType === "Cofounder Search" && (
          <>
            <Spacer y={2} />
            <Textarea
              type="text"
              label="Problem Statement"
              placeholder={"Example: My startup believes that Prosthetic limbs offer an amputee with a wide range of motion without providing them with detailed feedback and sensation. The amputee thinks of prosthesis as a foreign object and not as his own body part."}
              description={"Tell us about your problem statement in 200 words. (" + problemStatementWordCount + "/200)"}
              onValueChange={(val) => {
                handleInputFieldChange("problemStatement", val)
                handleProblemStatementWordCount(val)
              }}
              isRequired
            />
            <Spacer y={2} />
            <Textarea
              type="text"
              label="Startup Technology"
              placeholder={"Example: Our technology strength is the development of a cyclone generator that minimizes the soot emissions of diesels engines, reducing the amount of CO2 released in the atmosphere by 99.9%."}
              description={"Tell us about your startup technology in 100 words. (" + startupTechWordCount + "/100)"}
              onValueChange={(val) => {
                handleInputFieldChange("startupTechnology", val)
                handleStartupTechWordCount(val)
              }}
              isRequired
            />
          </>
        )}
        {categories.map((category, index) => (
          <div key={index}>
            <Spacer y={4} />
            <Divider className="mt-2 mb-4" />
            <p className="font-bold text-sm">
              { batSearchType === "Cofounder Search" ? category.cofounderSearchHeader : category.startupSearchHeader }
            </p>
            <p className="text-sm">Please select at least one option. Selections left: {category.maxOptions - batData.skills[category.key].length}</p>
            <Divider className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {category.skills.map((skill, index) => (
                <Checkbox 
                  key={index} 
                  value={skill}
                  size="sm" 
                  onChange={e => handleSkillsChange(category.key, e)}
                  isDisabled={
                    batData.skills[category.key].length >= category.maxOptions
                    && !batData.skills[category.key].includes(skill)
                  }
                >
                  {skill}
                </Checkbox>
              ))}
              {category.key !== "industry" && (
                <>
                  <Spacer y={4} />
                  <div className="flex">
                    <Checkbox
                      key={"Other"}
                      value={"Other"}
                      size="sm"
                      onChange={e => handleSkillsChange(category.key, e)}
                      isDisabled={
                        batData.skills[category.key].length >= category.maxOptions
                        && !batData.skills[category.key].includes("Other")
                      }
                    >
                    </Checkbox>
                    <Input
                      type="text"
                      size="sm"
                      variant="bordered"
                      label="Other"
                      labelPlacement="outside-left"
                      onValueChange={(val) => handleSkillsOtherOptionChange(category.key, val)}
                      isDisabled={!batData.skills[category.key].includes("Other")}
                      isRequired
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <Spacer y={8} />

      <div className="border rounded-xl p-6">
        <div className="flex w-full flex-col">
          <div>
            <p className="font-bold text-xl">
              Tell us about yourself.
            </p>
            <Spacer y={2} />
            { profileImage && <> <Image width={220} className="mr-3" src={profileImage} alt="Hatchery"/> <Spacer y={2} /> </> }          
            <span className="mr-2"> Upload Photo: </span>
            <input type="file" className="w-[105px]" onChange={e => handleImageUpload("profileImage", e)} accept="image/png, image/jpeg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Input
                type="text"
                variant="underlined"
                label="First Name"
                defaultValue={batData.profile.firstName}
                onValueChange={(val) => handleProfileInputFieldChange("firstName", val)}
                isRequired
              />
              <Input
                type="text"
                variant="underlined"
                label="Last Name"
                defaultValue={batData.profile.lastName}
                onValueChange={(val) => handleProfileInputFieldChange("lastName", val)}
                isRequired
              />
              <Input
                type="email"
                variant="underlined"
                label="Primary Email"
                defaultValue={batData.profile.primaryEmail}
                onValueChange={(val) => handleProfileInputFieldChange("primaryEmail", val)}
                isRequired
              />
              <Input
                type="email"
                variant="underlined"
                label="Personal Email"
                defaultValue={batData.profile.personalEmail}
                onValueChange={(val) => handleProfileInputFieldChange("personalEmail", val)}
                isRequired
              />
              <Input
                type="phone"
                variant="underlined"
                label="Phone Number"
                defaultValue={batData.profile.phone}
                onValueChange={(val) => handleProfileInputFieldChange("phone", val)}
                isRequired
              />
              <Input
                type="url"
                variant="underlined"
                label="LinkedIn URL"
                defaultValue={batData.profile.linkedIn}
                onValueChange={(val) => handleProfileInputFieldChange("linkedIn", val)}
                isRequired
              />
              <Select 
                variant="underlined"
                label="Gender"
                defaultSelectedKeys={batData.profile.gender !== "" ? [batData.profile.gender] : []}
                onChange={(e) => handleProfileInputFieldChange("gender", e.target.value)}
                isRequired
              >
                {genderOptions.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="text"
                variant="underlined"
                label="Area of Expertise"
                defaultValue={batData.profile.expertise}
                onValueChange={(val) => handleProfileInputFieldChange("expertise", val)}
                isRequired
              />
              <Input
                type="text"
                variant="underlined"
                label="Area of Interest"
                defaultValue={batData.profile.interest}
                onValueChange={(val) => handleProfileInputFieldChange("interest", val)}
                isRequired
              />
            </div>
            <Spacer y={8} />
            <Textarea
              type="text"
              variant="bordered"
              label="About Me"
              placeholder={"Example: I am in my 4th year of the Quantum Physics PhD program at UofT's Faculty of Engineering and did my undergrad in computer engineering with a concentration in Business. During this past summer, I interned at the Entrepreneurship Hatchery startup, collaborating with early-stage startups in refining their Business Plans and Cashflow Projections and Pitch. Between my undergraduate studies and PhD, I spent almost 2 years working in Strategy and Operations Consulting. In my spare time, I enjoy rock climbing, outdoors camping, and playing the guitar. My goal is to be in the Boston Marathon."}
              description={"Tell us about yourself in 50 words. (" + aboutWordCount + "/50)"}
              defaultValue={batData.profile.about}
              onValueChange={(val) => {
                handleProfileInputFieldChange("about", val)
                handleAboutWordCount(val)
              }}
              isRequired
            />
            <Spacer y={8} />
            <p className="font-bold">
              Educational History
            </p>
            <Spacer y={2} />
            <div>
              {batData.profile.education.map((edu, eduIndex) => (
                <div key={edu.id}>
                  <div className="flex items-start">
                    {eduIndex !== 0 && (
                      <Button 
                        isIconOnly 
                        color="danger" 
                        size="sm" 
                        variant="flat" 
                        className="rounded-full mt-4 mr-4"
                        onClick={() => handleRemoveEducation(eduIndex)}
                      >
                        x
                      </Button>
                    )}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Select 
                        variant="underlined"
                        label="Education Level"
                        defaultSelectedKeys={edu.educationLevel !== "" ? [edu.educationLevel] : []}
                        onChange={(e) => handleProfileEducationChange(eduIndex, "educationLevel", e.target.value)}
                        isRequired
                      >
                        {educationLevelOptions.map((edu) => (
                          <SelectItem key={edu} value={edu}>
                            {edu}
                          </SelectItem>
                        ))}
                      </Select>
                      <Autocomplete
                        allowsCustomValue
                        type="text"
                        variant="underlined"
                        label="Program"
                        defaultInputValue={edu.program}
                        onInputChange={(val) => handleProfileEducationChange(eduIndex, "program", val)}
                        isRequired
                      >
                        {programs.map((program, programIndex) => (
                          <AutocompleteItem key={programIndex} value={program}>
                            {program}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                      <Input
                        type="text"
                        variant="underlined"
                        label="University"
                        defaultValue={edu.university}
                        onValueChange={(val) => handleProfileEducationChange(eduIndex, "university", val)}
                        isRequired
                      />
                      <div className="flex items-center">
                        <Select 
                          variant="underlined"
                          label="Graduation Year"
                          defaultSelectedKeys={edu.gradYear !== -1 ? [String(edu.gradYear)] : []}
                          onChange={(e) => handleProfileEducationChange(eduIndex, "gradYear", parseInt(e.target.value))}
                          isRequired
                        >
                          {Array.from({ length: 131 }, (_, yearIndex) => {
                            const year = 2030 - yearIndex;
                            return (
                              <SelectItem key={year} value={year}>
                                  {String(year)}
                              </SelectItem>
                            );
                          })}
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Spacer y={2} />
                </div>
              ))}
              <div className="flex items-center mt-4 mr-4">
                <Button 
                  isIconOnly 
                  color="primary" 
                  size="sm" 
                  variant="flat" 
                  className="rounded-full inline-block"
                  onClick={() => handleAddEducation()}
                >
                  +
                </Button>
                <p className="ml-4 text-sm">Add row</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Spacer y={8} />

      <div className="border rounded-xl p-6">
        <p className="font-bold text-xl">
          Final Steps
        </p>
        <Spacer y={2} />
        <p className="text-sm">
          * The profile you are submitting will be discoverable on the Hatchery Build-A-Team Tool (a platform designed to match individuals and startups based on skills and interests)
        </p>
        <Spacer y={2} />
        <Checkbox 
          key={0}
          size="sm"
          onChange={() => setIsTermsChecked(!isTermsChecked)}
        >
          I agree to the <Link href="#" className="text-md font-bold hover:underline">terms and conditions</Link>
        </Checkbox>
        <Spacer y={4} />
        <Button 
          type="submit"
          color="primary"
          variant="flat"
          isDisabled={!isTermsChecked}
          onClick={submitProgramForm}
        >
          Submit
        </Button>
        <Spacer y={4} />
        {errors && (
          <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            size="2xl"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="font-bold">Form Errors</ModalHeader>
                  <ModalBody>
                    <p className="font-bold">
                      Please resolve the following form errors before continuing:
                    </p>
                    {errors.map((err, index) => (
                      <p key={index}>
                        {err}
                      </p>
                    ))}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </div>
      
      <Spacer y={8} />

    </div>
  );
}

export default ProgramFormComponent;