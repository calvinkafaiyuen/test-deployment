"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, User} from "@nextui-org/react";

import { getTeams } from "@/app/lib/actions/account/teamdropdown.action";

interface Team {
  id: number;
  pid: number;
  team_name: string;
  team_image: string;
  status: string;
  cohort: string;
}

export default function TeamDropdown({ team_id }: any) {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[] | null>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    getTeams().then(res => {
      setTeams(res);
      setSelectedTeam(res.find(team => team.id == team_id));
    });
  }, [team_id]);

  const handleSelectionChange = (e: any) => {
    const id = e.currentKey;
    router.push(`/account/${id}/profile`);
  }

  return (
    <div className="flex justify-end mt-[-15px] mb-3">
      <Dropdown shouldBlockScroll={false}>
        <DropdownTrigger>
          <Button variant="bordered" className="py-6">
            {selectedTeam ?
              <User   
                name={selectedTeam.team_name}
                description={selectedTeam.id}
                avatarProps={{
                  src: selectedTeam.team_image ? selectedTeam.team_image : '/placeholder-team.png',
                  size: 'sm',
                }}
              />
              :
              []
            } 
            
          </Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Team Dropdown"
          disallowEmptySelection
          selectionMode="single"
          onSelectionChange={handleSelectionChange}
        >
          {teams ? teams.map((item) => (
            <DropdownItem key={item.id} textValue={item.team_name}>
              <User   
                name={item.team_name}
                description={item.id.toString()}
                avatarProps={{
                  src: item.team_image ? item.team_image : '/placeholder-team.png',
                  size: 'sm'
                }}
              />
            </DropdownItem>
            ))
            :
            []
          }
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
